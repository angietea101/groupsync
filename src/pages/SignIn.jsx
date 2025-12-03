import React from 'react';
import { Link } from 'react-router-dom';
import './CreateAccount.css';
import Navbar from '../components/Navbar';
import GoogleIcon from '../assets/google.svg?react';
import AppleIcon from '../assets/apple.svg?react';
import GitHubIcon from '../assets/github.svg?react';

export default function SignIn() {
  return (
    <>
      <Navbar />

      <div className="create-container">
        <div className="create-card">
          <h1 className="title">Sign In</h1>
          <label>Email Address</label>
          <input type="email" placeholder="john@example.com" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <button className="create-btn">Sign In</button>

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
    </>
  );
}
