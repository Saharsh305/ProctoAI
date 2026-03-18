import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ShieldSvg = () => (
  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <path d="M100 10 L180 45 L180 110 C180 158 144 196 100 210 C56 196 20 158 20 110 L20 45 Z"
      fill="url(#shieldGrad)" opacity="0.15" />
    <path d="M100 22 L168 53 L168 110 C168 151 137 184 100 197 C63 184 32 151 32 110 L32 53 Z"
      fill="url(#shieldGrad)" opacity="0.25" />
    <path d="M100 36 L156 62 L156 110 C156 144 130 172 100 183 C70 172 44 144 44 110 L44 62 Z"
      fill="url(#shieldGrad)" />
    <circle cx="100" cy="105" r="28" fill="white" opacity="0.9" />
    <circle cx="100" cy="105" r="16" fill="url(#shieldGrad)" />
    <path d="M92 105 L98 111 L110 99" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Landing = () => {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Online Exam Proctoring Platform
            </div>
            <h1 className="hero-title">
              Online<br />
              <span>Exam Proctoring</span><br />
              Made Simple
            </h1>
            <p className="hero-subtitle">
              ProctoAI helps you run monitored online exams with clear logs and
              simple tools for admins and students.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/signin" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-graphic">
            <ShieldSvg />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-wrapper">
          <div className="section-header">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Everything you need for secure exams</h2>
            <p className="section-desc">
               Core tools for educators and students to run and monitor exams.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#ede9fe', color: '#4f46e5' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="feature-title">Secure Proctoring</div>
              <div className="feature-desc">
                Real-time monitoring with face detection, gaze tracking, and
                audio analysis. Immediately flags suspicious behaviors for review.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#cffafe', color: '#06b6d4' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="feature-title">Smart Detection</div>
              <div className="feature-desc">
                Advanced ML models detect tab switching, phone usage, head
                movements, and multiple persons with high accuracy and low false positives.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="feature-title">Easy Management</div>
              <div className="feature-desc">
                Intuitive admin dashboard to create exams, manage students, review
                proctoring logs, and export detailed reports.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="feature-title">Tamper Proof</div>
              <div className="feature-desc">
                Immutable event logs with timestamps capture every window switch,
                tab change, and suspicious action for post-exam review.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="feature-title">Real-time Alerts</div>
              <div className="feature-desc">
                Instant notifications to invigilators when violations are detected,
                with severity levels and contextual snapshots.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="feature-title">Rich Analytics</div>
              <div className="feature-desc">
                Comprehensive reports with charts, violation breakdowns, and
                per-student integrity scores to support fair grading.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="section-wrapper">
          <div className="section-header">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">Up and running in minutes</h2>
            <p className="section-desc">
              Three simple steps to deploy secure online examinations for your institution.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-title">Create an Exam</div>
              <div className="step-desc">
                Admin sets up the exam with title, duration, rules, and schedule.
                Students receive their unique access credentials.
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-title">Students Take the Test</div>
              <div className="step-desc">
                AI monitors students in real time via webcam and screen tracking.
                All events are logged and flagged automatically.
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-title">Review the Results</div>
              <div className="step-desc">
                Admins review proctoring logs, violation reports, and window event
                data to make informed integrity decisions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="features" style={{ background: 'var(--bg)', textAlign: 'center' }}>
        <div className="section-wrapper">
          <div className="section-header">
            <h2 className="section-title">Ready to get started?</h2>
            <p className="section-desc">
              Create your account and start using ProctoAI.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">Create Account</Link>
            <Link to="/signin" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} <span>ProctoAI</span>. All rights reserved. Online exam proctoring.</p>
      </footer>
    </div>
  );
};

export default Landing;
