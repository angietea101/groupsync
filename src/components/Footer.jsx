import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <Link
        to="/"
        className="footer-left"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <img src="/logo.png" alt="GroupSync Logo" className="logo" />
        <span className="footer-text">
          Group<span className="logo-accent">Sync</span>
        </span>
      </Link>

      <div className="footer-right">
        <span>Privacy</span>
        <span>Terms</span>
        <span>Support</span>
      </div>
    </footer>
  );
}
