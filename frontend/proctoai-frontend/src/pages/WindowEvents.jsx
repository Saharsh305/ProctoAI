import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { windowEventsAPI } from '../services/api';

const WindowEvents = () => {
  const [emailFilter, setEmailFilter] = useState('');
  const [testIdFilter, setTestIdFilter] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async () => {
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const data = await windowEventsAPI.list(emailFilter.trim(), testIdFilter.trim());
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch window events.');
      setEvents([]);
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
            <h1 className="page-title">Window Events</h1>
            <p className="page-subtitle">Track tab switches and window focus changes during exams</p>
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
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
              style={{ alignSelf: 'flex-end' }}
            >
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
                  setEvents([]);
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

          {!searched && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Search window events</h3>
              <p>Enter filters above and click Search to view events.</p>
            </div>
          )}

          {searched && !loading && events.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>No window events found</h3>
              <p>Try different filters or check back later.</p>
            </div>
          )}

          {events.length > 0 && (
            <div className="card card-no-hover" style={{ overflow: 'hidden' }}>
              <div
                className="card-header"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Window Events</h3>
                <span className="badge badge-accent">
                  {events.length} event{events.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Test ID</th>
                      <th>Event Type</th>
                      <th>Count</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((evt, i) => (
                      <tr key={evt.id || i}>
                        <td>{evt.email || '—'}</td>
                        <td>{evt.name || '—'}</td>
                        <td>
                          <span className="badge badge-gray">{evt.test_id || '—'}</span>
                        </td>
                        <td>
                          {evt.event_type ? (
                            <span className="badge badge-warning">{evt.event_type}</span>
                          ) : '—'}
                        </td>
                        <td>
                          {evt.count !== undefined ? (
                            <span style={{ fontWeight: 600, color: evt.count > 3 ? 'var(--danger)' : 'var(--text)' }}>
                              {evt.count}
                            </span>
                          ) : '—'}
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                          {formatDate(evt.timestamp || evt.created_at)}
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

export default WindowEvents;
