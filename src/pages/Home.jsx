import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import WatchIcon from '../assets/watch-icon.svg';

export default function Home() {
  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="GroupSync Logo" className="logo" />
          <span className="logo-text">
            Group<span className="logo-accent">Sync</span>
          </span>
        </div>

        <div className="navbar-center">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#team">Team</a>
        </div>

        <div className="navbar-right">
          <Link to="/signin" className="sign-in">
            Sign In
          </Link>
          <button className="get-started">Get Started</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          Find time. <span className="text-primary">Vote on ideas.</span> Make it happen.
        </h1>
        <p>
          Coordinate schedules, propose activities, and vote on the perfect plan. Making group
          decisions has never been this simple.
        </p>
        <div className="hero-buttons">
          <button className="start-planning">Start Planning</button>
          <button className="watch-demo">
            <img src={WatchIcon} alt="Watch icon" className="watch-icon" />
            Watch Demo
          </button>
        </div>
      </section>
    </div>
  );
}
