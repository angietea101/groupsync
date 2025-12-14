import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import './CreateAccount.css';
import Navbar from '../components/Navbar';
import GoogleIcon from '../assets/google.svg?react';
import AppleIcon from '../assets/apple.svg?react';
import GitHubIcon from '../assets/github.svg?react';
import Footer from '../components/Footer';
import { Eye, EyeOff } from 'lucide-react';

export default function CreateAccount() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const isFormValid =
    fullName.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0 && agree;
  const [loading, setLoading] = useState(false);

  async function handleCreateAccount() {
    if (!fullName || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    if (!agree) {
      setError('You must agree to the Terms & Privacy Policy.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create Firebase Auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name in Firebase Auth
      await updateProfile(res.user, {
        displayName: fullName,
      });

      // Create Firestore user document
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        fullName,
        email,
        createdEvents: [],
        createdAt: new Date(),
      });

      // Redirect to dashboard
      navigate('/viewplans');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />

      <div className="create-container">
        <div className="create-card">
          <h1 className="title">Create Account</h1>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
          />

          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />

            <label htmlFor="agree" className="agree-text">
              <span className="thin">I agree to the </span>
              <Link to="/terms" className="tos-link">
                Terms of Service
              </Link>
              <span className="thin"> and </span>
              <Link to="/privacy" className="tos-link">
                Privacy Policy
              </Link>
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            className="create-btn"
            disabled={!isFormValid || loading}
            onClick={handleCreateAccount}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn">
              <GoogleIcon className="icon" />
            </button>

            <button className="social-btn">
              <AppleIcon className="icon" />
            </button>

            <button className="social-btn">
              <GitHubIcon className="icon" />
            </button>
          </div>

          <p className="signin-text">Already have an account?</p>
          <p className="signin-link">
            <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
