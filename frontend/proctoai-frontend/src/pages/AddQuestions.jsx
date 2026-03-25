import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { examsAPI, authAPI } from '../services/api';

const AddQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    qid: '',
    q: '',
    a: '',
    b: '',
    c: '',
    d: '',
    ans: 'A',
    marks: '1',
  });

  useEffect(() => {
    loadData();
  }, [examId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [examData, questionsData, userData] = await Promise.all([
        examsAPI.get(examId),
        examsAPI.getQuestions(examId),
        authAPI.me(),
      ]);
      setExam(examData);
      setQuestions(questionsData);
      setCurrentUser(userData);
    } catch (err) {
      addToast(err.message || 'Failed to load exam data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!form.qid.trim()) return 'Question ID is required';
    if (!form.q.trim()) return 'Question text is required';
    if (!form.a.trim() || !form.b.trim() || !form.c.trim() || !form.d.trim()) {
      return 'All four options are required';
    }
    if (!['A', 'B', 'C', 'D'].includes(form.ans)) return 'Valid answer (A/B/C/D) is required';
    if (!form.marks || Number(form.marks) <= 0) return 'Valid marks value is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      addToast(error, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await examsAPI.addQuestion(examId, {
        ...form,
        marks: Number(form.marks),
        uid: currentUser.userId,
        examId,
      });
      addToast('Question added successfully!', 'success');
      setForm({
        qid: '',
        q: '',
        a: '',
        b: '',
        c: '',
        d: '',
        ans: 'A',
        marks: '1',
      });
      await loadData(); // Reload questions
    } catch (err) {
      addToast(err.message || 'Failed to add question', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await examsAPI.deleteQuestion(examId, questionId);
      addToast('Question deleted successfully!', 'success');
      await loadData(); // Reload questions
    } catch (err) {
      addToast(err.message || 'Failed to delete question', 'error');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <button
                className="btn btn-ghost"
                style={{ marginBottom: '0.5rem', padding: '0.25rem 0.5rem' }}
                onClick={() => navigate('/exams')}
              >
                ← Back to Exams
              </button>
              <h1 className="page-title">
                {exam ? `Manage Questions: ${exam.title}` : 'Manage Questions'}
              </h1>
              <p className="page-subtitle">Add and view questions for this exam</p>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Add Question Form */}
              <div className="card card-no-hover">
                <div className="card-body">
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    Add New Question
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="qid">
                          Question ID
                        </label>
                        <input
                          id="qid"
                          name="qid"
                          type="text"
                          className="form-control"
                          placeholder="e.g., Q1"
                          value={form.qid}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="marks">
                          Marks
                        </label>
                        <input
                          id="marks"
                          name="marks"
                          type="number"
                          min="1"
                          className="form-control"
                          value={form.marks}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="q">
                        Question Text
                      </label>
                      <textarea
                        id="q"
                        name="q"
                        className="form-control"
                        rows={3}
                        placeholder="Enter the question..."
                        value={form.q}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="a">
                          Option A
                        </label>
                        <input
                          id="a"
                          name="a"
                          type="text"
                          className="form-control"
                          value={form.a}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="b">
                          Option B
                        </label>
                        <input
                          id="b"
                          name="b"
                          type="text"
                          className="form-control"
                          value={form.b}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="c">
                          Option C
                        </label>
                        <input
                          id="c"
                          name="c"
                          type="text"
                          className="form-control"
                          value={form.c}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="d">
                          Option D
                        </label>
                        <input
                          id="d"
                          name="d"
                          type="text"
                          className="form-control"
                          value={form.d}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="ans">
                        Correct Answer
                      </label>
                      <select
                        id="ans"
                        name="ans"
                        className="form-control"
                        value={form.ans}
                        onChange={handleChange}
                        required
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{ minWidth: 140 }}
                    >
                      {submitting ? <LoadingSpinner /> : 'Add Question'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Questions List */}
              <div className="card card-no-hover">
                <div className="card-body">
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    Questions ({questions.length})
                  </h3>
                  {questions.length === 0 ? (
                    <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
                      No questions added yet. Add your first question above.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {questions.map((q, index) => (
                        <div
                          key={q.questions_uid}
                          style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                            <div style={{ fontWeight: 600 }}>
                              Q{index + 1} ({q.qid}) - {q.marks} marks
                            </div>
                            <button
                              onClick={() => handleDeleteQuestion(q.questions_uid)}
                              className="btn btn-ghost"
                              style={{
                                fontSize: '0.875rem',
                                padding: '0.25rem 0.5rem',
                                color: 'var(--danger)',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                          <div style={{ marginBottom: '0.75rem', color: 'var(--text)' }}>
                            {q.q}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <div style={{ color: q.ans === 'A' ? 'var(--success)' : 'var(--text-light)' }}>
                              <strong>A:</strong> {q.a}
                            </div>
                            <div style={{ color: q.ans === 'B' ? 'var(--success)' : 'var(--text-light)' }}>
                              <strong>B:</strong> {q.b}
                            </div>
                            <div style={{ color: q.ans === 'C' ? 'var(--success)' : 'var(--text-light)' }}>
                              <strong>C:</strong> {q.c}
                            </div>
                            <div style={{ color: q.ans === 'D' ? 'var(--success)' : 'var(--text-light)' }}>
                              <strong>D:</strong> {q.d}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default AddQuestions;
