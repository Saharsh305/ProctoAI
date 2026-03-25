import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import { examsAPI } from '../services/api';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    loadExamData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examId]);

  useEffect(() => {
    if (exam && !timerStarted) {
      const durationInSeconds = exam.duration * 60;
      setTimeLeft(durationInSeconds);
      startTimer(durationInSeconds);
      setTimerStarted(true);
    }
  }, [exam, timerStarted]);

  const startTimer = (initialTime) => {
    let remaining = initialTime;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleAutoSubmit();
      }
    }, 1000);
  };

  const loadExamData = async () => {
    try {
      setLoading(true);
      const [examData, questionsData] = await Promise.all([
        examsAPI.get(examId),
        examsAPI.getQuestions(examId),
      ]);
      setExam(examData);
      setQuestions(questionsData);

      // Initialize answers object
      const initialAnswers = {};
      questionsData.forEach((q) => {
        initialAnswers[q.qid] = '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      addToast(err.message || 'Failed to load exam', 'error');
      navigate('/student/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qid, answer) => {
    setAnswers((prev) => ({ ...prev, [qid]: answer }));
  };

  const handleAutoSubmit = async () => {
    addToast('Time is up! Submitting your exam...', 'info');
    await submitExam();
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to submit your exam? You cannot change your answers after submission.'
    );
    if (confirmed) {
      await submitExam();
    }
  };

  const submitExam = async () => {
    setSubmitting(true);
    try {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Prepare answers for submission
      const answersList = Object.entries(answers).map(([qid, answer]) => ({
        qid,
        answer: answer || 'Not Answered',
      }));

      await examsAPI.submit(examId, {
        examId,
        answers: answersList,
      });

      addToast('Exam submitted successfully!', 'success');
      setTimeout(() => {
        navigate('/student/exams');
      }, 2000);
    } catch (err) {
      addToast(err.message || 'Failed to submit exam', 'error');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (exam?.duration * 60)) * 100;
    if (percentage > 50) return 'var(--success)';
    if (percentage > 20) return 'var(--warning)';
    return 'var(--danger)';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <LoadingSpinner />
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Timer & Header */}
        <div style={{ position: 'sticky', top: '4rem', zIndex: 10, background: 'var(--bg)', padding: '1rem 0', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {exam?.title}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                {questions.length} Questions
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                Time Remaining
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: getTimeColor(), fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          {questions.map((question, index) => (
            <div key={question.questions_uid} className="card card-no-hover">
              <div className="card-body">
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)' }}>
                    Question {index + 1}
                  </span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    ({question.marks} {question.marks === 1 ? 'mark' : 'marks'})
                  </span>
                </div>
                <div style={{ marginBottom: '1.25rem', fontSize: '1rem', lineHeight: 1.6 }}>
                  {question.q}
                </div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem',
                        border: `2px solid ${answers[question.qid] === option ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        background: answers[question.qid] === option ? '#ede9fe' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${question.qid}`}
                        value={option}
                        checked={answers[question.qid] === option}
                        onChange={(e) => handleAnswerChange(question.qid, e.target.value)}
                        style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{option}.</span>
                      <span>{question[option.toLowerCase()]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div style={{ position: 'sticky', bottom: 0, padding: '1.5rem 0', background: 'var(--bg)' }}>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                  Answered: {Object.values(answers).filter((a) => a).length} / {questions.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Make sure you've answered all questions before submitting
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
                style={{ minWidth: 140 }}
              >
                {submitting ? <LoadingSpinner /> : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default TakeExam;
