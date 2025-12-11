import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Vote, Share2 } from 'lucide-react';

import WatchIcon from '../assets/watch-icon.svg';
import PlusIcon from '../assets/plus.svg';
import GroupIcon from '../assets/group.svg';
import CheckmarkIcon from '../assets/checkmark.svg';

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    works: false,
  });

  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section');
            setIsVisible((prev) => ({ ...prev, [section]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const featuresSection = document.querySelector('[data-section="features"]');
    const worksSection = document.querySelector('[data-section="works"]');

    if (featuresSection) observer.observe(featuresSection);
    if (worksSection) observer.observe(worksSection);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className={isVisible.hero ? 'animate-fade-in-down' : 'animation-ready'}>
          Find time. <span className="text-primary">Vote on ideas.</span> Make it happen.
        </h1>
        <p className={isVisible.hero ? 'animate-fade-in-up' : 'animation-ready'}>
          Coordinate schedules, propose activities, and vote on the perfect plan. Making group
          decisions has never been this simple.
        </p>
        <div className="hero-buttons">
          <Link to="/createaccount">
            <button
              className={`start-planning button-hover ${isVisible.hero ? 'animate-slide-in-left' : 'animation-ready'}`}
            >
              Start Planning
            </button>
          </Link>
          <button
            className={`watch-demo ${isVisible.hero ? 'animate-slide-in-right' : 'animation-ready'}`}
          >
            <img src={WatchIcon} alt="Watch icon" className="watch-icon" />
            Watch Demo
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className={`features ${isVisible.features ? 'section-visible' : ''}`}
        data-section="features"
      >
        <h2
          className={`features-title ${isVisible.features ? 'animate-fade-in-up' : 'animation-ready'}`}
        >
          Everything you need
        </h2>
        <p
          className={`features-subtitle ${isVisible.features ? 'animate-fade-in-up animation-delay-100' : 'animation-ready'}`}
        >
          Powerful features that make group event planning effortless and enjoyable
        </p>

        <div className="features-grid">
          <div
            className={`feature-item hover-lift ${isVisible.features ? 'animate-scale-in animation-delay-200' : 'animation-ready'}`}
          >
            <div className="feature-icon-container">
              <Calendar className="feature-icon" size={40} strokeWidth={1.5} />
            </div>
            <h3>Scheduling</h3>
            <p>
              Share availability with visual grids. Find the perfect time that works for everyone
              instantly.
            </p>
          </div>

          <div
            className={`feature-item hover-lift ${isVisible.features ? 'animate-scale-in animation-delay-400' : 'animation-ready'}`}
          >
            <div className="feature-icon-container">
              <Vote className="feature-icon" size={40} strokeWidth={1.5} />
            </div>
            <h3>Group Vote</h3>
            <p>
              Propose activities and let everyone vote. Democracy meets event planning for better
              group decisions.
            </p>
          </div>

          <div
            className={`feature-item hover-lift ${isVisible.features ? 'animate-scale-in animation-delay-600' : 'animation-ready'}`}
          >
            <div className="feature-icon-container">
              <Share2 className="feature-icon" size={40} strokeWidth={1.5} />
            </div>
            <h3>Easy Sharing</h3>
            <p>
              Send invite links instantly. No accounts needed for participants — just like
              when2meet, but better.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className={`works ${isVisible.works ? 'section-visible' : ''}`}
        data-section="works"
      >
        <h2
          className={`features-title ${isVisible.works ? 'animate-fade-in-up' : 'animation-ready'}`}
        >
          How it Works
        </h2>
        <p
          className={`features-subtitle ${isVisible.works ? 'animate-fade-in-up animation-delay-200' : 'animation-ready'}`}
        >
          Three simple steps to organize the perfect group event.
        </p>

        <div className="features-grid">
          <div
            className={`feature-item ${isVisible.works ? 'animate-slide-in-left animation-delay-300' : 'animation-ready'}`}
          >
            <div className="works-icon">1</div>
            <h3>Create Event</h3>
            <p>
              Set up your event with dates and times. Add a description and any initial activity
              ideas.
            </p>

            <div className="works-outer-rect hover-lift">
              <div className="works-inner-rect">
                <img src={PlusIcon} alt="Icon" className="works-rect-icon" />
              </div>
            </div>
          </div>

          <div
            className={`feature-item ${isVisible.works ? 'animate-scale-in animation-delay-400' : 'animation-ready'}`}
          >
            <div className="works-icon animation-delay-400">2</div>
            <h3>Share & Collect</h3>
            <p>
              Send the link to friends. They mark availability and suggest activities to vote on.
            </p>

            <div className="works-outer-rect hover-lift">
              <div className="works-inner-rect">
                <img src={GroupIcon} alt="Icon" className="works-rect-icon" />
              </div>
            </div>
          </div>

          <div
            className={`feature-item ${isVisible.works ? 'animate-slide-in-right animation-delay-600' : 'animation-ready'}`}
          >
            <div className="works-icon animation-delay-600">3</div>
            <h3>Vote & Plan</h3>
            <p>Everyone votes on activities and times. The best option wins automatically.</p>

            <div className="works-outer-rect hover-lift">
              <div className="works-inner-rect">
                <img src={CheckmarkIcon} alt="Icon" className="works-rect-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
