import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { examsAPI } from '../services/api';

const EXAM_STATUSES = ['DRAFT', 'ACTIVE', 'COMPLETED'];

const validateExamForm = (form) => {
  if (!form.title.trim()) return 'Exam title is required.';
  if (!form.duration || Number(form.duration) <= 0) return 'Please enter a valid duration.';
  return null;
};

const CreateExam = () => {
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    duration: '',
    startTime: '',
    rules: '',
    status: 'DRAFT',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateExamForm(form);
    if (validationError) {
      addToast(validationError, 'error');
      return;
    }
    setLoading(true);
    setSuccess(false);
    try {
      const createdExam = await examsAPI.create({
        title: form.title.trim(),
        duration: Number(form.duration),
        startTime: form.startTime || null,
        rules: form.rules.trim(),
        status: form.status,
      });
      addToast('Exam created successfully! Redirecting to add questions...', 'success');
      // Navigate to add questions page for the newly created exam
      setTimeout(() => {
        navigate(`/exams/${createdExam.examId}/questions`);
      }, 1000);
    } catch (err) {
      addToast(err.message || 'Failed to create exam.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Create Exam</h1>
            <p className="page-subtitle">Set up a new examination session</p>
          </div>

          <div style={{ maxWidth: 600 }}>
            <div className="card card-no-hover">
              <div className="card-body">
                {success && (
                  <div
                    style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    ✓ Exam created successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="title">
                      Exam Title <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Introduction to Computer Science – Mid Term"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="duration">
                        Duration (minutes) <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <input
                        id="duration"
                        name="duration"
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="60"
                        value={form.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={handleChange}
                      >
                        {EXAM_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="startTime">Start Time</label>
                    <input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      className="form-control"
                      value={form.startTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rules">Rules &amp; Instructions</label>
                    <textarea
                      id="rules"
                      name="rules"
                      className="form-control"
                      placeholder="Enter exam rules, instructions, and guidelines for students…"
                      value={form.rules}
                      onChange={handleChange}
                      rows={5}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ minWidth: 140 }}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner /> : 'Create Exam'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setForm({ title: '', duration: '', startTime: '', rules: '', status: 'DRAFT' })}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info panel */}
            <div
              className="card card-no-hover"
              style={{ marginTop: '1.25rem', background: '#ede9fe', border: '1px solid #c4b5fd' }}
            >
              <div className="card-body" style={{ display: 'flex', gap: '0.875rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.375rem' }}>
                    Exam Status Guide
                  </p>
                  <ul style={{ color: 'var(--primary-dark)', fontSize: '0.875rem', lineHeight: 1.75 }}>
                    <li><strong>DRAFT</strong> – Exam is being prepared, not visible to students</li>
                    <li><strong>ACTIVE</strong> – Exam is live and accessible to students</li>
                    <li><strong>COMPLETED</strong> – Exam has ended, results are available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default CreateExam;
