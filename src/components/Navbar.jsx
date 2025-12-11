import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link
            to="/"
            className="logo-link"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              closeMobileMenu();
            }}
          >
            <img src="/logo.png" alt="GroupSync Logo" className="logo" />
            <span className="logo-text">
              Group<span className="logo-accent">Sync</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center desktop-only">
          <Link to="/#features">Features</Link>
          <Link to="/#how-it-works">How it Works</Link>
          <Link to="/#team">Team</Link>
        </div>

        <div className="navbar-right desktop-only">
          {!user ? (
            <>
              <Link to="/signin" className="sign-in">
                Sign In
              </Link>
              <Link to="/createaccount">
                <button className="get-started">Get Started</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/viewevents" className="sign-in">
                View Events
              </Link>
              <Link to="/createplan">
                <button className="get-started">Plan Event</button>
              </Link>
            </>
          )}
        </div>

        <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-links">
          <Link to="/#features" onClick={closeMobileMenu}>
            Features
          </Link>
          <Link to="/#how-it-works" onClick={closeMobileMenu}>
            How it Works
          </Link>
          <Link to="/#team" onClick={closeMobileMenu}>
            Team
          </Link>
        </div>

        <div className="mobile-auth">
          {!user ? (
            <>
              <Link to="/signin" className="mobile-sign-in" onClick={closeMobileMenu}>
                Sign In
              </Link>
              <Link to="/createaccount" onClick={closeMobileMenu}>
                <button className="get-started mobile-btn">Get Started</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/viewevents" className="mobile-sign-in" onClick={closeMobileMenu}>
                View Events
              </Link>
              <Link to="/plan" onClick={closeMobileMenu}>
                <button className="get-started mobile-btn">Plan Events</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
