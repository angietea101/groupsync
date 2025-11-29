import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/logo.png" alt="GroupSync Logo" className="logo" />
        <span className="footer-text">
          Group<span className="logo-accent">Sync</span>
        </span>
      </div>

      <div className="footer-right">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/support">Support</Link>
      </div>
    </footer>
  );
}
