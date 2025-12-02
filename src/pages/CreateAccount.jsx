import React from 'react';
import { Link } from 'react-router-dom';
import './CreateAccount.css';
import Navbar from '../components/Navbar';
import GoogleIcon from '../assets/google.svg';
import AppleIcon from '../assets/apple.svg';
import GitHubIcon from '../assets/github.svg';

export default function CreateAccount() {
  return (
    <>
      <Navbar />

      <div className="create-container">
        <div className="create-card">
          <h1 className="title">Create Account</h1>

          <label>Full Name</label>
          <input type="text" placeholder="John Doe" />

          <label>Email Address</label>
          <input type="email" placeholder="john@example.com" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <div className="checkbox-row">
            <input type="checkbox" id="agree" />

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

          <button className="create-btn">Create Account</button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn google">
              <img src={GoogleIcon} alt="Google" />
            </button>

            <button className="social-btn apple">
              <img src={AppleIcon} alt="Apple" />
            </button>

            <button className="social-btn discord">
              <img src={GitHubIcon} alt="Discord" />
            </button>
          </div>

          <p className="signin-text">Already have an account?</p>
          <p className="signin-link">
            <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
