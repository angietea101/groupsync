import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateAccount.css';
import Navbar from '../components/Navbar';
import GoogleIcon from '../assets/google.svg?react';
import AppleIcon from '../assets/apple.svg?react';
import GitHubIcon from '../assets/github.svg?react';
import Footer from '../components/Footer';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/viewevents'); // redirect when successful
    } catch (err) {
      setError('Invalid email or password');
      console.error('Sign-in error:', err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-container">
        <div className="create-card">
          <h1 className="title">Sign In</h1>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

          <button className="create-btn" onClick={handleSignIn}>
            Sign In
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

          <p className="signin-text">Don't have an account?</p>
          <p className="signin-link">
            <Link to="/createaccount">Register</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
