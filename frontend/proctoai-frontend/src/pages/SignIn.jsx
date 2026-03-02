import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/useAuth';
import FormGroup from '../components/ui/forms/FormGroup';
import Button from '../components/ui/buttons/Button';

const SignIn = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const data = await login(formData.email, formData.password);
      loginUser(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-header bg-secondary text-white" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-soft">
              <div className="card-header bg-white text-center">
                <Link to="/" className="d-flex justify-content-center align-items-center mb-3">
                  <span className="h4 mb-0 font-weight-bold text-primary">ProctoAI</span>
                </Link>
                <h1 className="h4 mb-1">Sign in to your account</h1>
                <p className="text-muted font-small">Welcome back! Please enter your details.</p>
              </div>
              <div className="card-body px-5">
                {error && (
                  <div className="mb-3 p-3 rounded" style={{ background: '#fdecea', color: '#c0392b', border: '1px solid #f5c6cb' }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
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

                  <Button type="submit" variant="primary" block disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </form>
              </div>
              <div className="card-footer bg-white text-center">
                <p className="text-muted font-small mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-weight-bold">
                    Sign up
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

export default SignIn;
