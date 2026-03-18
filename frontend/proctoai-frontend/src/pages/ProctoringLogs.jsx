import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { proctoringAPI } from '../services/api';

const ProctoringLogs = () => {
  const [emailFilter, setEmailFilter] = useState('');
  const [testIdFilter, setTestIdFilter] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async () => {
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const data = await proctoringAPI.getLogs(emailFilter.trim(), testIdFilter.trim());
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [emailFilter, testIdFilter]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (val) => {
    if (!val) return '—';
    try {
      return new Date(val).toLocaleString();
    } catch {
      return val;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Proctoring Logs</h1>
            <p className="page-subtitle">Review all AI proctoring events and violations</p>
          </div>

          {/* Filter bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Student Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="student@example.com"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Test ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. test_001"
                value={testIdFilter}
                onChange={(e) => setTestIdFilter(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ alignSelf: 'flex-end' }}>
              {loading ? <LoadingSpinner /> : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </>
              )}
            </button>
            {searched && (
              <button
                className="btn btn-ghost"
                style={{ alignSelf: 'flex-end' }}
                onClick={() => {
                  setEmailFilter('');
                  setTestIdFilter('');
                  setLogs([]);
                  setSearched(false);
                  setError('');
                }}
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="error-msg" style={{ marginBottom: '1.25rem' }}>{error}</div>
          )}

          {/* Results */}
          {!searched && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>Search proctoring logs</h3>
              <p>Enter filters above and click Search to view logs.</p>
            </div>
          )}

          {searched && !loading && logs.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>No logs found</h3>
              <p>Try different filters or check back later.</p>
            </div>
          )}

          {logs.length > 0 && (
            <div className="card card-no-hover" style={{ overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
                  Proctoring Logs
                </h3>
                <span className="badge badge-primary">{logs.length} record{logs.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Test ID</th>
                      <th>Voice (dB)</th>
                      <th>Head Up/Down</th>
                      <th>Head LR</th>
                      <th>Eyes</th>
                      <th>Phone</th>
                      <th>Person Status</th>
                      <th>Log Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={log.id || i}>
                        <td>{log.email || '—'}</td>
                        <td>{log.name || '—'}</td>
                        <td>
                          <span className="badge badge-gray">{log.test_id || '—'}</span>
                        </td>
                        <td>{log.voice_db ?? '—'}</td>
                        <td>{log.head_move_ud ?? log.movements_ud ?? '—'}</td>
                        <td>{log.head_move_lr ?? log.movements_lr ?? '—'}</td>
                        <td>{log.eye_movement ?? log.eyes ?? '—'}</td>
                        <td>
                          {log.phone_detected !== undefined ? (
                            <span className={`badge ${log.phone_detected ? 'badge-danger' : 'badge-success'}`}>
                              {log.phone_detected ? 'Yes' : 'No'}
                            </span>
                          ) : '—'}
                        </td>
                        <td>
                          {log.person_status ? (
                            <span className={`badge ${log.person_status === 'present' ? 'badge-success' : 'badge-warning'}`}>
                              {log.person_status}
                            </span>
                          ) : '—'}
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                          {formatDate(log.log_time || log.timestamp || log.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProctoringLogs;
