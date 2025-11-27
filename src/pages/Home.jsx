import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Navbar from '../components/Navbar';

import WatchIcon from '../assets/watch-icon.svg';
import SchedulingIcon from '../assets/scheduling.svg';
import VoteIcon from '../assets/vote.svg';
import ShareIcon from '../assets/share.svg';

export default function Home() {
  return (
    <div className="home-container">
      {/* NAVBAR */}
      <Navbar />

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

      {/* FEATURES SECTION */}
      <section className="features">
        <h2 className="features-title">Everything you need</h2>
        <p className="features-subtitle">
          Powerful features that make group event planning effortless and enjoyable
        </p>

        <div className="features-grid">
          <div className="feature-item">
            <img src={SchedulingIcon} alt="Scheduling Icon" className="feature-icon" />
            <h3>Scheduling</h3>
            <p>
              Share availability with visual grids. Find the perfect time that works for everyone
              instantly.
            </p>
          </div>

          <div className="feature-item">
            <img src={VoteIcon} alt="Group Vote Icon" className="feature-icon" />
            <h3>Group Vote</h3>
            <p>
              Propose activities and let everyone vote. Democracy meets event planning for better
              group decisions.
            </p>
          </div>

          <div className="feature-item">
            <img src={ShareIcon} alt="Easy Sharing Icon" className="feature-icon" />
            <h3>Easy Sharing</h3>
            <p>
              Send invite links instantly. No accounts needed for participants — just like
              when2meet, but better.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
