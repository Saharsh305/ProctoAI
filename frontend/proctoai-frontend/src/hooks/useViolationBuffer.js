/**
 * useViolationBuffer – client-side batch buffer (Sprint 3).
 *
 * Accumulates violations in memory and flushes them to the backend
 * batch endpoint every `flushInterval` ms.  Also handles evidence
 * upload (screenshot → presigned URL → MinIO → object_url attached
 * to the violation record).
 */

import { useRef, useCallback, useEffect } from 'react';
import { proctoringAPI } from '../services/api';
import { captureScreenshot, uploadToPresignedUrl } from '../utils/screenshotCapture';

const DEFAULT_FLUSH_INTERVAL = 2000; // 2 s – matches backend buffer

/**
 * @param {Object}  opts
 * @param {React.RefObject} opts.webcamRef   – react-webcam ref for screenshots
 * @param {number}  [opts.flushInterval=2000]
 * @param {boolean} [opts.captureEvidence=true]
 */
export default function useViolationBuffer({
  webcamRef,
  flushInterval = DEFAULT_FLUSH_INTERVAL,
  captureEvidence = true,
} = {}) {
  const bufferRef = useRef([]);
  const timerRef = useRef(null);

  // ── Flush buffer to backend ──────────────────────
  const flush = useCallback(async () => {
    if (bufferRef.current.length === 0) return;

    const batch = [...bufferRef.current];
    bufferRef.current = [];

    try {
      await proctoringAPI.logViolationBatch({ violations: batch });
    } catch (err) {
      console.error('[useViolationBuffer] Batch flush failed, re-queuing:', err);
      // Put them back at the front so they retry on next flush
      bufferRef.current = [...batch, ...bufferRef.current];
    }
  }, []);

  // ── Start / stop flush timer ─────────────────────
  useEffect(() => {
    timerRef.current = setInterval(flush, flushInterval);
    return () => {
      clearInterval(timerRef.current);
      // Final flush on unmount
      flush();
    };
  }, [flush, flushInterval]);

  // ── Enqueue a violation (with optional evidence capture) ──
  const enqueue = useCallback(
    async (violationData) => {
      let evidence_url = null;

      if (captureEvidence && webcamRef) {
        try {
          const blob = await captureScreenshot(webcamRef);
          if (blob) {
            const { data } = await proctoringAPI.getEvidenceUploadUrl({
              test_id: violationData.test_id,
              email: violationData.email,
              violation_type: violationData.violation_type,
              timestamp_ms: Date.now(),
            });
            const ok = await uploadToPresignedUrl(data.upload_url, blob);
            if (ok) {
              evidence_url = data.object_url;
            }
          }
        } catch (err) {
          console.warn('[useViolationBuffer] Evidence capture/upload failed:', err);
        }
      }

      bufferRef.current.push({
        ...violationData,
        evidence_url,
      });
    },
    [webcamRef, captureEvidence],
  );

  return { enqueue, flush, pendingCount: () => bufferRef.current.length };
}
