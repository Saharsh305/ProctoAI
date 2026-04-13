import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { examsAPI } from '../services/api';

const StudentExams = () => {
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [submittedExamIds, setSubmittedExamIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const [data, submitted] = await Promise.all([
        examsAPI.list(),
        examsAPI.mySubmissions().catch(() => []),
      ]);
      // Filter only ACTIVE exams for students
      setExams(data.filter((exam) => exam.status === 'active'));
      setSubmittedExamIds(new Set(submitted));
    } catch (err) {
      addToast(err.message || 'Failed to load exams', 'error');
    } finally {
      setLoading(false);
    }
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
            <h1 className="page-title">My Exams</h1>
            <p className="page-subtitle">View and attempt available examinations</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <LoadingSpinner />
            </div>
          ) : exams.length === 0 ? (
            <div className="card card-no-hover">
              <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-light)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ margin: '0 auto 1.5rem' }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                  No Active Exams
                </h3>
                <p style={{ color: 'var(--text-light)' }}>
                  There are currently no active exams available. Check back later.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {exams.map((exam) => (
                <div key={exam.examId} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          {exam.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                          <div>
                            <strong>Start:</strong> {formatDate(exam.startTime)}
                          </div>
                          <div>
                            <strong>Duration:</strong> {exam.duration} minutes
                          </div>
                        </div>
                        {exam.rules && (
                          <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Rules & Instructions:</strong>
                            <div style={{ color: 'var(--text-light)', whiteSpace: 'pre-wrap' }}>
                              {exam.rules}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {submittedExamIds.has(exam.examId) ? (
                          <button
                            className="btn btn-ghost"
                            disabled
                            style={{ opacity: 0.7 }}
                          >
                            ✅ Submitted
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/student/exams/${exam.examId}/take`)}
                          >
                            Start Exam
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default StudentExams;
