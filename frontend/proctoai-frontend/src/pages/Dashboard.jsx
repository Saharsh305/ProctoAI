import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { listQuestions, listTeachers, listProctoringLogs } from '../services/api';
import MainLayout from '../components/layout/MainLayout';

const StatCard = ({ icon, label, value, color = 'primary' }) => (
  <div className="col-12 col-md-4 mb-4">
    <div className="card border-light shadow-soft">
      <div className="card-body d-flex align-items-center">
        <div className={`icon icon-${color} mr-3`}>
          <span className={`fas ${icon}`}></span>
        </div>
        <div>
          <p className="text-muted font-small mb-0">{label}</p>
          <h3 className="h4 mb-0">{value}</h3>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, token, logoutUser, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ questions: null, tests: null, logs: null });
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (!loading && !token) {
      navigate('/signin');
    }
  }, [loading, token, navigate]);

  useEffect(() => {
    if (!token) return;
    Promise.allSettled([
      listQuestions(token),
      listTeachers(token),
      listProctoringLogs(token),
    ]).then(([q, t, l]) => {
      setStats({
        questions: q.status === 'fulfilled' ? q.value.length : 'N/A',
        tests: t.status === 'fulfilled' ? t.value.length : 'N/A',
        logs: l.status === 'fulfilled' ? l.value.length : 'N/A',
      });
    }).catch(() => setStatsError('Could not load stats'));
  }, [token]);

  if (loading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="container text-center">
            <p>Loading…</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <section className="section-header bg-primary text-white pb-11">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-md-8">
              <h1 className="display-2 mb-3">Welcome back, {user.name}!</h1>
              <p className="lead mb-0">
                Role: <span className="font-weight-bold">{user.role}</span> &nbsp;|&nbsp;
                Exam Credits: <span className="font-weight-bold">{user.examcredits}</span>
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-right mt-4 mt-md-0">
              <button className="btn btn-outline-soft" onClick={logoutUser}>
                <span className="fas fa-sign-out-alt mr-2"></span>Sign out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section mt-n9">
        <div className="container">
          {statsError && (
            <div className="mb-4 p-3 rounded" style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
              {statsError}
            </div>
          )}
          <div className="row">
            <StatCard icon="fa-question-circle" label="Questions" value={stats.questions ?? '…'} color="primary" />
            <StatCard icon="fa-clipboard-list" label="Tests" value={stats.tests ?? '…'} color="secondary" />
            <StatCard icon="fa-eye" label="Proctoring Logs" value={stats.logs ?? '…'} color="dark" />
          </div>

          <div className="row mt-4">
            <div className="col-12 col-md-6 mb-4">
              <div className="card border-light shadow-soft">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0">Account Details</h2>
                </div>
                <div className="card-body">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        ['User ID', user.user_id],
                        ['Name', user.name],
                        ['Email', user.email],
                        ['Role', user.role],
                        ['Exam Credits', user.examcredits],
                        ['Member since', new Date(user.created_at).toLocaleDateString()],
                      ].map(([label, value]) => (
                        <tr key={label} style={{ borderBottom: '1px solid #e3e6f0' }}>
                          <td style={{ padding: '0.625rem', fontWeight: 600, width: '40%', color: '#8898aa' }}>{label}</td>
                          <td style={{ padding: '0.625rem', wordBreak: 'break-all' }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="card border-light shadow-soft">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0">Quick Actions</h2>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {user.role === 'admin' && (
                      <li className="mb-3">
                        <Link to="/exam/create" className="btn btn-primary btn-block">
                          <span className="fas fa-plus mr-2"></span>Create Exam
                        </Link>
                      </li>
                    )}
                    <li className="mb-3">
                      <Link to="/questions" className="btn btn-secondary btn-block">
                        <span className="fas fa-list mr-2"></span>View Questions
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link to="/proctoring" className="btn btn-tertiary btn-block">
                        <span className="fas fa-eye mr-2"></span>Proctoring Logs
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
