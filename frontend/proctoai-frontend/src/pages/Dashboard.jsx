import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { examsAPI } from '../services/api';

const StatCard = ({ label, value, icon, colorClass, delay = 0 }) => (
  <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
    <div className={`stat-icon ${colorClass}`}>{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(user?.role === 'admin');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    examsAPI.list()
      .then(setExams)
      .finally(() => setLoading(false));
  }, [user]);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-wrapper">
            {/* Welcome card */}
            <div className="welcome-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <h2>Welcome back, {user?.name || 'User'}!</h2>
                  <p>
                    {user?.role === 'admin'
                      ? 'Manage exams and questions here.'
                      : 'View your upcoming exams and take them here.'}
                  </p>
                </div>
              </div>
            </div>

            {user?.role === 'admin' ? (
              <>
                {/* Admin stats */}
                <div className="page-header">
                  <h1 className="page-title">Overview</h1>
                  <p className="page-subtitle">Exam management summary</p>
                </div>

                <div className="stats-grid">
                  <StatCard
                    label="Total Exams"
                    value={loading ? '…' : exams.length}
                    colorClass="stat-icon-primary"
                    delay={0}
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Draft Exams"
                    value={loading ? '…' : exams.filter(e => e.status === 'DRAFT').length}
                    colorClass="stat-icon-accent"
                    delay={80}
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Active Exams"
                    value={loading ? '…' : exams.filter(e => e.status === 'ACTIVE').length}
                    colorClass="stat-icon-success"
                    delay={160}
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    }
                  />
                </div>

                {/* Quick actions */}
                <div className="page-header" style={{ marginTop: '1rem' }}>
                  <h2 className="page-title" style={{ fontSize: '1.25rem' }}>Quick Actions</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { to: '/exams', label: 'View All Exams', color: 'var(--primary)', bg: '#ede9fe' },
                    { to: '/exams/create', label: 'Create Exam', color: '#059669', bg: '#d1fae5' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="card card-no-hover"
                      style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none', borderLeftColor: item.color, borderLeftWidth: 3 }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                        →
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.label}</span>
                    </Link>
                  ))}
                </div>

              </>
            ) : (
              /* Student view */
              <>
                <div className="page-header">
                  <h1 className="page-title">My Dashboard</h1>
                  <p className="page-subtitle">Your exam overview</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div className="card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Account Info</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
                      <strong>Name:</strong> {user?.name}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <strong>Role:</strong>{' '}
                      <span className="badge badge-accent">{user?.role}</span>
                    </p>
                  </div>
                  <div className="card" style={{ padding: '1.75rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Getting Started</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      Check "My Exams" to view available exams.
                      Make sure you have a stable internet connection before starting any exam.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
