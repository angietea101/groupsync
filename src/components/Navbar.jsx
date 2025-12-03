import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to="/"
          className="logo-link"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src="/logo.png" alt="GroupSync Logo" className="logo" />
          <span className="logo-text">
            Group<span className="logo-accent">Sync</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/#features">Features</Link>
        <Link to="/#how-it-works">How it Works</Link>
        <Link to="/#team">Team</Link>
      </div>

      <div className="navbar-right">
        <Link to="/signin" className="sign-in">
          Sign In
        </Link>
        <Link to="/createaccount">
          <button className="get-started">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
