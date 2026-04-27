import { useNavigate } from 'react-router-dom';
import './auth.css';

export function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back!</h1>
        <p className="subtitle">Sign in to continue your journey</p>
        
        <form className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="auth-button">Sign In</button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} className="auth-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Start planning your adventures</p>
        
        <form className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button type="submit" className="auth-button">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/signin')} className="auth-link">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}