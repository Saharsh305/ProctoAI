import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminAPI } from '../services/api';

// ── Severity badge colours ────────────────────────────
const SEVERITY_STYLES = {
  info: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  warning: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  critical: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const ACTION_STYLES = {
  warn: { bg: '#fef3c7', color: '#92400e', label: '⚠️ Warn' },
  invalidate: { bg: '#fce7f3', color: '#9d174d', label: '🚫 Invalidate' },
  ban: { bg: '#fee2e2', color: '#991b1b', label: '🔒 Ban' },
};

const Badge = ({ text, style }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '9999px',
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'capitalize',
      background: style?.bg || '#f1f5f9',
      color: style?.color || '#475569',
      border: `1px solid ${style?.border || '#cbd5e1'}`,
    }}
  >
    {text}
  </span>
);

// ── Action Modal ──────────────────────────────────────
const ActionModal = ({ violation, onClose, onSubmit, loading }) => {
  const [actionType, setActionType] = useState('warn');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit({ violation_id: violation.vid, action_type: actionType, reason: reason || null });
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 'var(--radius-lg, 16px)',
          padding: '2rem', maxWidth: 480, width: '90vw',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: '0.5rem' }}>Take Action on Violation #{violation.vid}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
          {violation.violation_type} — {violation.message}
        </p>

        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
          Action Type
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['warn', 'invalidate', 'ban'].map((t) => (
            <button
              key={t}
              onClick={() => setActionType(t)}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm, 8px)',
                border: `2px solid ${actionType === t ? ACTION_STYLES[t].color : '#e2e8f0'}`,
                background: actionType === t ? ACTION_STYLES[t].bg : '#fff',
                color: actionType === t ? ACTION_STYLES[t].color : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {ACTION_STYLES[t].label}
            </button>
          ))}
        </div>

        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
          Reason (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Add a reason for this action..."
          style={{
            width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm, 8px)',
            border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'vertical',
            marginBottom: '1.25rem', fontFamily: 'inherit',
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading} style={{ minWidth: 100 }}>
            {loading ? <LoadingSpinner /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Sort helper ───────────────────────────────────────
const SORT_FIELDS = [
  { key: 'created_at', label: 'Date' },
  { key: 'severity', label: 'Severity' },
  { key: 'violation_type', label: 'Type' },
  { key: 'email', label: 'Student' },
];

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };

const AdminDashboard = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [violations, setViolations] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [tab, setTab] = useState('exams'); // exams | violations | audit

  // Filters
  const [filterEmail, setFilterEmail] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  // Sort
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  // Stats
  const [totalCount, setTotalCount] = useState(0);

  // Exam Monitoring
  const [examOverview, setExamOverview] = useState([]);
  const [examDetail, setExamDetail] = useState(null);
  const [examLoading, setExamLoading] = useState(false);

  const loadExamOverview = useCallback(async () => {
    try {
      setExamLoading(true);
      const data = await adminAPI.examStudents();
      setExamOverview(data);
    } catch (err) {
      addToast(err.message || 'Failed to load exam data', 'error');
    } finally {
      setExamLoading(false);
    }
  }, [addToast]);

  const loadExamDetail = useCallback(async (testId) => {
    try {
      setExamLoading(true);
      const data = await adminAPI.examStudents(testId);
      setExamDetail(data);
    } catch (err) {
      addToast(err.message || 'Failed to load exam detail', 'error');
    } finally {
      setExamLoading(false);
    }
  }, [addToast]);

  const loadViolations = useCallback(async () => {
    try {
      setLoading(true);
      const [data, countData] = await Promise.all([
        adminAPI.listViolations(filterEmail, '', filterType, filterSeverity),
        adminAPI.countViolations(),
      ]);
      setViolations(data);
      setTotalCount(countData.count);
    } catch (err) {
      addToast(err.message || 'Failed to load violations', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterEmail, filterType, filterSeverity, addToast]);

  const loadAuditLog = useCallback(async () => {
    try {
      const data = await adminAPI.listActions();
      setAuditLog(data);
    } catch (err) {
      addToast(err.message || 'Failed to load audit log', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    loadViolations();
  }, [loadViolations]);

  useEffect(() => {
    if (tab === 'audit') loadAuditLog();
    if (tab === 'exams') loadExamOverview();
  }, [tab, loadAuditLog, loadExamOverview]);

  const handleAction = async (payload) => {
    try {
      setActionLoading(true);
      await adminAPI.performAction(payload);
      addToast(`Action "${payload.action_type}" recorded successfully`, 'success');
      setSelectedViolation(null);
      await loadViolations();
      if (tab === 'audit') await loadAuditLog();
    } catch (err) {
      addToast(err.message || 'Failed to perform action', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedViolations = useMemo(() => {
    const copy = [...violations];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'severity') {
        cmp = (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3);
      } else if (sortField === 'created_at') {
        cmp = new Date(a.created_at) - new Date(b.created_at);
      } else {
        cmp = String(a[sortField] || '').localeCompare(String(b[sortField] || ''));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [violations, sortField, sortDir]);

  // Unique values for filter dropdowns
  const uniqueTypes = useMemo(() => [...new Set(violations.map((v) => v.violation_type))], [violations]);
  const uniqueSeverities = useMemo(() => [...new Set(violations.map((v) => v.severity))], [violations]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <Navbar />

      {/* Action Modal */}
      {selectedViolation && (
        <ActionModal
          violation={selectedViolation}
          onClose={() => setSelectedViolation(null)}
          onSubmit={handleAction}
          loading={actionLoading}
        />
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            🛡️ Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Monitor violations, take actions, and review audit history.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Violations', value: totalCount, icon: '🚨', color: '#ef4444' },
            { label: 'Critical', value: violations.filter((v) => v.severity === 'critical').length, icon: '🔴', color: '#dc2626' },
            { label: 'Warnings', value: violations.filter((v) => v.severity === 'warning').length, icon: '🟡', color: '#f59e0b' },
            { label: 'Actions Taken', value: violations.reduce((acc, v) => acc + (v.actions?.length || 0), 0), icon: '⚡', color: '#6366f1' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card card-no-hover"
              style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
          {[
            { key: 'exams', label: '📊 Exam Monitoring' },
            { key: 'violations', label: '📋 Violations' },
            { key: 'audit', label: '📜 Audit Log' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-sm, 8px) var(--radius-sm, 8px) 0 0',
                border: 'none',
                borderBottom: tab === t.key ? '3px solid var(--primary, #6366f1)' : '3px solid transparent',
                background: tab === t.key ? '#fff' : 'transparent',
                fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? 'var(--primary, #6366f1)' : 'var(--text-light)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Exam Monitoring Tab ─────────────────── */}
        {tab === 'exams' && (
          <div className="card card-no-hover" style={{ padding: '1.25rem' }}>
            {examDetail ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                      📝 {examDetail.exam_title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {examDetail.students?.length || 0} student(s) with proctoring data
                    </p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setExamDetail(null)}>
                    ← Back to Exams
                  </button>
                </div>

                {examDetail.students?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-light)' }}>
                    No student proctoring data for this exam yet.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '0.6rem', textAlign: 'left' }}>Student Email</th>
                          <th style={{ padding: '0.6rem', textAlign: 'center' }}>Violations</th>
                          <th style={{ padding: '0.6rem', textAlign: 'center' }}>Trust Score</th>
                          <th style={{ padding: '0.6rem', textAlign: 'center' }}>Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examDetail.students.map((s) => {
                          const trustColor = s.trust_score == null
                            ? '#94a3b8'
                            : s.trust_score >= 70
                            ? '#10b981'
                            : s.trust_score >= 40
                            ? '#f59e0b'
                            : '#ef4444';
                          return (
                            <tr key={s.email} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.6rem', color: '#6366f1', fontSize: '0.8rem' }}>{s.email}</td>
                              <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 600 }}>{s.violation_count}</td>
                              <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                <span style={{ fontWeight: 700, color: trustColor }}>
                                  {s.trust_score != null ? `${s.trust_score}/100` : '—'}
                                </span>
                              </td>
                              <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                                {s.report_id ? (
                                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>✅ Generated</span>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Exams with Proctoring Data</h3>
                  <button className="btn btn-ghost btn-sm" onClick={loadExamOverview}>🔄 Refresh</button>
                </div>

                {examLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                    <LoadingSpinner />
                  </div>
                ) : examOverview.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-light)' }}>
                    No proctoring data found yet.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '0.6rem', textAlign: 'left' }}>Exam</th>
                          <th style={{ padding: '0.6rem', textAlign: 'center' }}>Students</th>
                          <th style={{ padding: '0.6rem', textAlign: 'center' }}>Total Violations</th>
                          <th style={{ padding: '0.6rem', textAlign: 'center' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {examOverview.map((ex) => (
                          <tr key={ex.test_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.6rem', fontWeight: 600 }}>{ex.exam_title}</td>
                            <td style={{ padding: '0.6rem', textAlign: 'center' }}>{ex.student_count}</td>
                            <td style={{ padding: '0.6rem', textAlign: 'center', color: ex.total_violations > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                              {ex.total_violations}
                            </td>
                            <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                                onClick={() => loadExamDetail(ex.test_id)}
                              >
                                View Students
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── Violations Tab ──────────────────────── */}
        {tab === 'violations' && (
          <div className="card card-no-hover" style={{ padding: '1.25rem' }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Filter by email..."
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm, 8px)',
                  border: '1px solid #e2e8f0', fontSize: '0.8rem', minWidth: 180,
                }}
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm, 8px)',
                  border: '1px solid #e2e8f0', fontSize: '0.8rem', background: '#fff',
                }}
              >
                <option value="">All Types</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm, 8px)',
                  border: '1px solid #e2e8f0', fontSize: '0.8rem', background: '#fff',
                }}
              >
                <option value="">All Severities</option>
                {uniqueSeverities.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="btn btn-ghost btn-sm" onClick={loadViolations}>
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <LoadingSpinner />
              </div>
            ) : sortedViolations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-light)' }}>
                No violations found.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>#</th>
                      {SORT_FIELDS.map((sf) => (
                        <th
                          key={sf.key}
                          onClick={() => toggleSort(sf.key)}
                          style={{
                            padding: '0.6rem', textAlign: 'left', cursor: 'pointer',
                            userSelect: 'none', whiteSpace: 'nowrap',
                          }}
                        >
                          {sf.label}{' '}
                          {sortField === sf.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                      ))}
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Message</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Actions</th>
                      <th style={{ padding: '0.6rem', textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedViolations.map((v) => (
                      <tr key={v.vid} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem', fontWeight: 600, color: '#94a3b8' }}>{v.vid}</td>
                        <td style={{ padding: '0.6rem', whiteSpace: 'nowrap' }}>{formatDate(v.created_at)}</td>
                        <td style={{ padding: '0.6rem' }}>
                          <Badge text={v.severity} style={SEVERITY_STYLES[v.severity]} />
                        </td>
                        <td style={{ padding: '0.6rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {v.violation_type}
                        </td>
                        <td style={{ padding: '0.6rem', fontSize: '0.75rem', color: '#6366f1' }}>
                          {v.email}
                        </td>
                        <td style={{ padding: '0.6rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {v.message}
                        </td>
                        <td style={{ padding: '0.6rem' }}>
                          {v.actions && v.actions.length > 0 ? (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {v.actions.map((a) => (
                                <Badge
                                  key={a.action_id}
                                  text={a.action_type}
                                  style={ACTION_STYLES[a.action_type]}
                                />
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => setSelectedViolation(v)}
                          >
                            ⚡ Act
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Audit Log Tab ──────────────────────── */}
        {tab === 'audit' && (
          <div className="card card-no-hover" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Action Audit Log</h3>
              <button className="btn btn-ghost btn-sm" onClick={loadAuditLog}>
                🔄 Refresh
              </button>
            </div>

            {auditLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-light)' }}>
                No actions recorded yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Violation</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Action</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Reason</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Performed By</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((a) => (
                      <tr key={a.action_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.6rem', fontWeight: 600, color: '#94a3b8' }}>{a.action_id}</td>
                        <td style={{ padding: '0.6rem' }}>#{a.violation_id}</td>
                        <td style={{ padding: '0.6rem' }}>
                          <Badge text={a.action_type} style={ACTION_STYLES[a.action_type]} />
                        </td>
                        <td style={{ padding: '0.6rem', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {a.reason || '—'}
                        </td>
                        <td style={{ padding: '0.6rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          {a.performed_by?.slice(0, 8)}…
                        </td>
                        <td style={{ padding: '0.6rem', whiteSpace: 'nowrap' }}>{formatDate(a.performed_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default AdminDashboard;
