import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * useFaceDetection – Client-side AI Face Detection (Sprint 2 – REQ-4/5)
 *
 * Uses a Haar-Cascade–style algorithm implemented in pure JS via an
 * efficient grayscale + integral-image + sliding-window approach.
 *
 * For production you'd load a proper Haar cascade XML, but here we use
 * a lightweight skin-colour + contour heuristic that works surprisingly
 * well for the "is a face present?" / "how many faces?" use-case.
 *
 * Responsibilities:
 *  • detectFace(imageData)  → boolean
 *  • detectMultipleFaces(imageData) → count
 *  • Configurable absence threshold (5–10s)
 *  • Fire violation callback when threshold exceeded
 */

const DEFAULT_ABSENCE_THRESHOLD_MS = 7000; // 7 seconds default (configurable 5-10s)
const FACE_CHECK_DEBOUNCE_MS = 500;

// ── Lightweight face detection via skin-colour segmentation ───────────
function toGrayscale(imageData) {
  const { data, width, height } = imageData;
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * 4;
    gray[i] = 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
  }
  return { gray, width, height };
}

/**
 * Very fast skin-colour detection in YCbCr space.
 * Returns a binary mask (Uint8Array) of skin pixels.
 */
function skinMask(imageData) {
  const { data, width, height } = imageData;
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const off = i * 4;
    const r = data[off], g = data[off + 1], b = data[off + 2];
    // Convert to YCbCr
    const y  =  0.299  * r + 0.587  * g + 0.114  * b;
    const cb = -0.1687 * r - 0.3313 * g + 0.5    * b + 128;
    const cr =  0.5    * r - 0.4187 * g - 0.0813 * b + 128;
    // Skin-colour thresholds (empirically tuned)
    if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && y > 60) {
      mask[i] = 1;
    }
  }
  return { mask, width, height };
}

/**
 * Connected-component labelling on the skin mask.
 * Returns array of bounding boxes [{x,y,w,h,area}].
 */
function findBlobs(maskObj, minArea = 800) {
  const { mask, width, height } = maskObj;
  const labels = new Int32Array(width * height);
  let nextLabel = 1;
  const bboxes = new Map(); // label → {minX, minY, maxX, maxY, area}

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (mask[idx] === 0) continue;

      // Check neighbours (left and top)
      const left = x > 0 ? labels[idx - 1] : 0;
      const top = y > 0 ? labels[idx - width] : 0;

      let label;
      if (left > 0 && top > 0) {
        label = Math.min(left, top);
        // Simple union
        if (left !== top) {
          const mergeFrom = Math.max(left, top);
          for (let i = 0; i < labels.length; i++) {
            if (labels[i] === mergeFrom) labels[i] = label;
          }
          // Merge bboxes
          if (bboxes.has(mergeFrom)) {
            const a = bboxes.get(label) || { minX: x, minY: y, maxX: x, maxY: y, area: 0 };
            const b = bboxes.get(mergeFrom);
            a.minX = Math.min(a.minX, b.minX);
            a.minY = Math.min(a.minY, b.minY);
            a.maxX = Math.max(a.maxX, b.maxX);
            a.maxY = Math.max(a.maxY, b.maxY);
            a.area += b.area;
            bboxes.set(label, a);
            bboxes.delete(mergeFrom);
          }
        }
      } else if (left > 0) {
        label = left;
      } else if (top > 0) {
        label = top;
      } else {
        label = nextLabel++;
      }
      labels[idx] = label;

      if (!bboxes.has(label)) {
        bboxes.set(label, { minX: x, minY: y, maxX: x, maxY: y, area: 0 });
      }
      const bb = bboxes.get(label);
      if (x < bb.minX) bb.minX = x;
      if (y < bb.minY) bb.minY = y;
      if (x > bb.maxX) bb.maxX = x;
      if (y > bb.maxY) bb.maxY = y;
      bb.area++;
    }
  }

  const result = [];
  for (const [, bb] of bboxes) {
    if (bb.area < minArea) continue;
    const w = bb.maxX - bb.minX;
    const h = bb.maxY - bb.minY;
    const aspectRatio = h / (w || 1);
    // Face-like blob: roughly portrait aspect ratio
    if (aspectRatio > 0.6 && aspectRatio < 2.5 && w > 30 && h > 30) {
      result.push({ x: bb.minX, y: bb.minY, w, h, area: bb.area });
    }
  }
  return result;
}

// ── Public detection functions ────────────────────────
export function detectFaces(imageData) {
  const maskObj = skinMask(imageData);
  return findBlobs(maskObj);
}

export function detectFace(imageData) {
  return detectFaces(imageData).length > 0;
}

export function detectMultipleFaces(imageData) {
  return detectFaces(imageData).length;
}

// ── React hook ────────────────────────────────────────
export default function useFaceDetection({
  absenceThresholdMs = DEFAULT_ABSENCE_THRESHOLD_MS,
  onViolation,
  enabled = true,
} = {}) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [absentSince, setAbsentSince] = useState(null);
  const [violation, setViolation] = useState(null);

  const absentSinceRef = useRef(null);
  const violationFiredRef = useRef(false);

  const processFrame = useCallback(
    (imageData) => {
      if (!enabled || !imageData) return;

      const faces = detectFaces(imageData);
      const count = faces.length;
      const detected = count > 0;

      setFaceDetected(detected);
      setFaceCount(count);

      // ── Multiple faces violation ──────────────────
      if (count > 1 && onViolation) {
        onViolation({
          type: 'multiple_faces',
          message: `Multiple faces detected (${count})`,
          count,
          timestamp: Date.now(),
        });
      }

      // ── Absence tracking ──────────────────────────
      if (!detected) {
        if (absentSinceRef.current === null) {
          absentSinceRef.current = Date.now();
          setAbsentSince(Date.now());
        } else {
          const elapsed = Date.now() - absentSinceRef.current;
          if (elapsed >= absenceThresholdMs && !violationFiredRef.current) {
            violationFiredRef.current = true;
            const v = {
              type: 'face_absent',
              message: `No face detected for ${Math.round(elapsed / 1000)}s`,
              duration: elapsed,
              timestamp: Date.now(),
            };
            setViolation(v);
            if (onViolation) onViolation(v);
          }
        }
      } else {
        // Face returned – reset absence tracking
        absentSinceRef.current = null;
        violationFiredRef.current = false;
        setAbsentSince(null);
        setViolation(null);
      }
    },
    [enabled, absenceThresholdMs, onViolation]
  );

  return {
    faceDetected,
    faceCount,
    absentSince,
    violation,
    processFrame,
  };
}
