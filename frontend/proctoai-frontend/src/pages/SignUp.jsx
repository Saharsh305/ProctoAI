import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import FormGroup from '../components/ui/forms/FormGroup';
import Button from '../components/ui/buttons/Button';

const ROLES = ['student', 'admin'];

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    user_image: '',
    user_login: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      navigate('/signin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-header bg-primary text-white" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-soft">
              <div className="card-header bg-white text-center">
                <Link to="/" className="d-flex justify-content-center align-items-center mb-3">
                  <span className="h4 mb-0 font-weight-bold text-primary">ProctoAI</span>
                </Link>
                <h1 className="h4 mb-1">Create your account</h1>
                <p className="text-muted font-small">Start your proctoring journey today.</p>
              </div>
              <div className="card-body px-5">
                {error && (
                  <div className="mb-3 p-3 rounded" style={{ background: '#fdecea', color: '#c0392b', border: '1px solid #f5c6cb' }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <FormGroup label="Full Name" htmlFor="name" icon="user">
                    <input
                      className="form-control"
                      placeholder="John Doe"
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Email address" htmlFor="email" icon="at">
                    <input
                      className="form-control"
                      placeholder="example@company.com"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Password" htmlFor="password" icon="lock">
                    <input
                      className="form-control"
                      placeholder="Password"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <div className="form-group mb-4">
                    <label className="h6" htmlFor="role">Role</label>
                    <select
                      className="form-control"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" variant="secondary" block disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                  </Button>
                </form>
              </div>
              <div className="card-footer bg-white text-center">
                <p className="text-muted font-small mb-0">
                  Already have an account?{' '}
                  <Link to="/signin" className="font-weight-bold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
