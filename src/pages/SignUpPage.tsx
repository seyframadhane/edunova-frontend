import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import signUpImage from '../assets/SignIn/Sign_up_image.png';
import logo from '../assets/landingPage/Logo_landing_page.png';
import { useAuth } from '../context/AuthContext';

// Social icons as simple SVGs
const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TwitterXIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4L20 20M20 4L4 20" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#555" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4" stroke="#555" strokeWidth="1.8" />
    <circle cx="17.5" cy="6.5" r="1" fill="#555" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 9H2V21H6V9Z" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="4" r="2" stroke="#555" strokeWidth="1.8" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const SignUpPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      navigate('/home');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* ── Left: hero image ── */}
      <div style={styles.imagePanel}>
        <img src={signUpImage} alt="Sign up visual" style={styles.heroImage} />
      </div>

      {/* ── Right: form panel ── */}
      <div style={styles.formPanel}>
        <div style={styles.formContainer}>
          {/* Logo */}
          <div className='w-50 h-20'>
            <img src={logo} alt="EduNova AI logo" />
          </div>

          {/* Heading */}
          <h1 style={styles.heading}>Create an account</h1>

          {/* Google button */}
          <button
            type="button"
            style={styles.googleBtn}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fff')}
          >
            <span style={styles.googleBtnText}>Create account with Google</span>
            <GoogleIcon />
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>Or</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Error banner */}
          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={e => (e.currentTarget.style.borderColor = '#6C3EF4')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
              />
            </div>

            {/* First Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>First Name</label>
              <input
                id="signup-firstname"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={e => (e.currentTarget.style.borderColor = '#6C3EF4')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
              />
            </div>

            {/* Last Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                id="signup-lastname"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={e => (e.currentTarget.style.borderColor = '#6C3EF4')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create your password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{ ...styles.input, paddingRight: '44px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#6C3EF4')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye size={18} color="#999" /> : <EyeOff size={18} color="#999" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Re-enter Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, paddingRight: '44px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#6C3EF4')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <Eye size={18} color="#999" /> : <EyeOff size={18} color="#999" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a2ad4'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a1a2e'; }}
            >
            {loading ? 'Creating…' : 'Create an account'}
          </button>
        </form>

        {/* Login link */}
        <p style={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>
            Login
          </Link>
        </p>

        {/* Social icons */}
        <div style={styles.socialRow}>
          <a href="#" aria-label="Facebook" style={styles.socialIcon}><FacebookIcon /></a>
          <a href="#" aria-label="X / Twitter" style={styles.socialIcon}><TwitterXIcon /></a>
          <a href="#" aria-label="Instagram" style={styles.socialIcon}><InstagramIcon /></a>
          <a href="#" aria-label="LinkedIn" style={styles.socialIcon}><LinkedInIcon /></a>
        </div>
      </div>
    </div>
    </div >
  );
};

// ── Inline styles ──────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: '#fff' },
  imagePanel: { flex: '0 0 48%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  formPanel: {
    flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 32px', backgroundColor: '#fff',
    borderTopLeftRadius: '28px', borderBottomLeftRadius: '28px',
    boxShadow: '-8px 0 40px rgba(0,0,0,0.06)', marginLeft: '-28px', zIndex: 1,
  },
  formContainer: { width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' },
  heading: { fontSize: '26px', fontWeight: 600, color: '#1a1a2e', marginBottom: '22px', textAlign: 'center', letterSpacing: '-0.4px' },
  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    width: '100%', padding: '13px 20px', borderRadius: '10px',
    border: '1.5px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer',
    transition: 'background-color 0.2s', marginBottom: '18px',
  },
  googleBtnText: { fontSize: '14px', fontWeight: 500, color: '#1a1a2e' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '18px' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#E0E0E0', display: 'block' },
  dividerText: { fontSize: '13px', color: '#999', flexShrink: 0 },
  errorBox: {
    width: '100%', padding: '10px 14px', marginBottom: '12px',
    backgroundColor: '#FEE2E2', color: '#B91C1C',
    borderRadius: '10px', fontSize: '13px', fontWeight: 500,
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: 500, color: '#444' },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #E0E0E0', fontSize: '14px', color: '#1a1a2e',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', backgroundColor: '#fff',
  },
  passwordWrapper: { position: 'relative', width: '100%' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
    display: 'flex', alignItems: 'center',
  },
  submitBtn: {
    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
    backgroundColor: '#1a1a2e', color: '#fff', fontSize: '15px', fontWeight: 600,
    cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '4px', letterSpacing: '0.2px',
  },
  loginText: { fontSize: '13px', color: '#666', marginTop: '14px', textAlign: 'center' },
  loginLink: { color: '#1a1a2e', fontWeight: 700, textDecoration: 'none' },
  socialRow: { display: 'flex', gap: '18px', marginTop: '22px', alignItems: 'center', justifyContent: 'center' },
  socialIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', textDecoration: 'none', transition: 'opacity 0.2s', opacity: 1 },
};

export default SignUpPage;