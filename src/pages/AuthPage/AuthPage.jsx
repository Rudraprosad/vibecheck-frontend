import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useApp } from '../../context/AppContext';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useApp();

  const [tab, setTab]           = useState('login'); // 'login' | 'signup'
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (signupForm.password !== signupForm.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await signup(signupForm.name, signupForm.email, signupForm.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const handleSocialMock = (provider) => {
    setError('Social login is not fully implemented yet in the backend.');
  };

  return (
    <div className="auth">
      <div className="auth__card" role="main">
        {/* Logo */}
        <div className="auth__logo">
          <Link to="/" className="auth__logo-link">
            <span className="auth__logo-mark">V</span>
            <span className="auth__logo-text">VibeCheck</span>
          </Link>
          <p className="auth__tagline">Plan Your Perfect Trip</p>
        </div>

        {/* Tabs */}
        <div className="auth__tabs" role="tablist" aria-label="Login or Sign Up">
          <button
            role="tab"
            id="tab-login"
            aria-selected={tab === 'login'}
            aria-controls="panel-login"
            className={`auth__tab ${tab === 'login' ? 'auth__tab--active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Login
          </button>
          <button
            role="tab"
            id="tab-signup"
            aria-selected={tab === 'signup'}
            aria-controls="panel-signup"
            className={`auth__tab ${tab === 'signup' ? 'auth__tab--active' : ''}`}
            onClick={() => { setTab('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 0, fontSize: '0.8125rem', py: 0.5 }}>
            {error}
          </Alert>
        )}

        {/* ── Login Form ── */}
        {tab === 'login' && (
          <form
            id="panel-login"
            role="tabpanel"
            aria-labelledby="tab-login"
            className="auth__form"
            onSubmit={handleLogin}
          >
            <TextField
              id="login-email"
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
              fullWidth
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="login-password"
              label="Password"
              type={showPwd ? 'text' : 'password'}
              value={loginForm.password}
              onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
              fullWidth
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd(v => !v)}
                      size="small"
                      edge="end"
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      sx={{ color: '#A855F7' }}
                    >
                      {showPwd
                        ? <VisibilityOffIcon sx={{ fontSize: 16 }} />
                        : <VisibilityIcon   sx={{ fontSize: 16 }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="auth__forgot">
              <button type="button" className="auth__forgot-btn">Forgot password?</button>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.25, fontWeight: 700, borderRadius: '10px' }}
            >
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </form>
        )}

        {/* ── Signup Form ── */}
        {tab === 'signup' && (
          <form
            id="panel-signup"
            role="tabpanel"
            aria-labelledby="tab-signup"
            className="auth__form"
            onSubmit={handleSignup}
          >
            <TextField
              id="signup-name"
              label="Full Name"
              value={signupForm.name}
              onChange={e => setSignupForm(p => ({ ...p, name: e.target.value }))}
              fullWidth
              autoComplete="name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="signup-email"
              label="Email"
              type="email"
              value={signupForm.email}
              onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))}
              fullWidth
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="signup-password"
              label="Password"
              type={showPwd ? 'text' : 'password'}
              value={signupForm.password}
              onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))}
              fullWidth
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd(v => !v)}
                      size="small"
                      edge="end"
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      sx={{ color: '#A855F7' }}
                    >
                      {showPwd
                        ? <VisibilityOffIcon sx={{ fontSize: 16 }} />
                        : <VisibilityIcon   sx={{ fontSize: 16 }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="signup-confirm"
              label="Confirm Password"
              type={showPwd ? 'text' : 'password'}
              value={signupForm.confirm}
              onChange={e => setSignupForm(p => ({ ...p, confirm: e.target.value }))}
              fullWidth
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 16, color: '#A855F7' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.25, fontWeight: 700, borderRadius: '10px' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
        )}

        {/* Social divider */}
        <div className="auth__divider">
          <Divider sx={{ borderColor: '#E9D5FF', flex: 1 }} />
          <span className="auth__divider-text">OR</span>
          <Divider sx={{ borderColor: '#E9D5FF', flex: 1 }} />
        </div>

        {/* Social buttons */}
        <div className="auth__social">
          <Button
            id="auth-google"
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
            onClick={() => handleSocialMock('Google')}
            sx={{ py: 1.1, fontWeight: 600, fontSize: '0.875rem' }}
          >
            Continue with Google
          </Button>
          <Button
            id="auth-facebook"
            variant="outlined"
            fullWidth
            startIcon={<FacebookIcon sx={{ fontSize: 18 }} />}
            onClick={() => handleSocialMock('Facebook')}
            sx={{ py: 1.1, fontWeight: 600, fontSize: '0.875rem' }}
          >
            Continue with Facebook
          </Button>
        </div>

        {/* Demo hint */}
        <p className="auth__demo-hint">
          Research prototype — any email and password will work for demo.
        </p>
      </div>
    </div>
  );
}

