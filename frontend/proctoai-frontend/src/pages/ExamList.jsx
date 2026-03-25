import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { examsAPI } from '../services/api';

const ExamList = () => {
  const { toasts, addToast, removeToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      // Filter to show only admin's own exams
      const myExams = user && user.role === 'admin';
      const data = await examsAPI.list(0, 100, myExams);
      setExams(data);
    } catch (err) {
      addToast(err.message || 'Failed to load exams', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: { bg: '#f3f4f6', color: '#374151', text: 'Draft' },
      scheduled: { bg: '#dbeafe', color: '#1e40af', text: 'Scheduled' },
      active: { bg: '#d1fae5', color: '#065f46', text: 'Active' },
      completed: { bg: '#fee2e2', color: '#991b1b', text: 'Completed' },
    };
    const style = styles[status] || styles.draft;
    return (
      <span
        style={{
          background: style.bg,
          color: style.color,
          padding: '0.25rem 0.625rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {style.text}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">{user?.role === 'admin' ? 'My Exams' : 'All Exams'}</h1>
            <p className="page-subtitle">Manage and monitor {user?.role === 'admin' ? 'your' : 'all'} examinations</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <LoadingSpinner />
            </div>
          ) : exams.length === 0 ? (
            <div className="card card-no-hover">
              <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                  No exams found. Create your first exam to get started.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/exams/create')}
                >
                  Create Exam
                </button>
              </div>
            </div>
          ) : (
            <div className="card card-no-hover">
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                          Title
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                          Status
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                          Start Time
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                          Duration
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam) => (
                        <tr
                          key={exam.examId}
                          style={{ borderBottom: '1px solid var(--border)' }}
                        >
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 500 }}>{exam.title}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>{getStatusBadge(exam.status)}</td>
                          <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            {formatDate(exam.startTime)}
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                            {exam.duration} min
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-ghost"
                                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
                                onClick={() => navigate(`/exams/${exam.examId}/questions`)}
                              >
                                Manage Questions
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ExamList;
