import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Vote, Share2 } from 'lucide-react';

import { auth } from '../services/firebase';

import WatchIcon from '../assets/watch-icon.svg';
import PlusIcon from '../assets/plus.svg';
import GroupIcon from '../assets/group.svg';
import CheckmarkIcon from '../assets/checkmark.svg';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('has-animated');
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  return (
    <div className="home-container">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="reveal animate-fade-in-down">
          Find time. <span className="text-primary">Vote on ideas.</span> Make it happen.
        </h1>
        <p className="reveal animate-fade-in-up">
          Coordinate schedules, propose activities, and vote on the perfect plan. Making group
          decisions has never been this simple.
        </p>
        <div className="hero-buttons">
          <button
            onClick={() => {
              if (user) {
                navigate('/createplan');
              } else {
                navigate('/createaccount');
              }
            }}
            className="reveal animate-slide-in-left start-planning hover-lift"
          >
            Start Planning
          </button>
          <button className="reveal animate-slide-in-right watch-demo">
            <img src={WatchIcon} alt="Watch icon" className="watch-icon" />
            Watch Demo
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features">
        <h2 className="reveal animate-fade-in-up">Everything you need</h2>
        <p className="reveal animate-fade-in-up animation-delay-100">
          Powerful features that make group event planning effortless and enjoyable
        </p>

        <div className="features-grid">
          <div className="feature-item reveal animate-scale-in animation-delay-200 hover-lift">
            <div className="feature-icon-container">
              <Calendar className="feature-icon" size={40} strokeWidth={1.5} />
            </div>
            <h3>Scheduling</h3>
            <p>
              Share availability with visual grids. Find the perfect time that works for everyone
              instantly.
            </p>
          </div>

          <div className="feature-item reveal animate-scale-in animation-delay-400 hover-lift">
            <div className="feature-icon-container">
              <Vote className="feature-icon" size={40} strokeWidth={1.5} />
            </div>
            <h3>Group Vote</h3>
            <p>
              Propose activities and let everyone vote. Democracy meets event planning for better
              group decisions.
            </p>
          </div>

          <div className="feature-item reveal animate-scale-in animation-delay-600 hover-lift">
            <div className="feature-icon-container">
              <Share2 className="feature-icon" size={40} strokeWidth={1.5} />
            </div>
            <h3>Easy Sharing</h3>
            <p>Send invite links instantly. No accounts needed for participants.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="works">
        <h2 className="reveal animate-fade-in-up">How it Works</h2>
        <p className="reveal animate-fade-in-up animation-delay-200">
          Three simple steps to organize the perfect group event.
        </p>

        <div className="features-grid">
          <div className="feature-item reveal animate-slide-in-left animation-delay-300">
            <div className="works-icon">1</div>
            <h3>Create Event</h3>
            <p>Set up your event with dates. Add a description and any initial activity ideas.</p>
            <div className="works-outer-rect hover-lift">
              <div className="works-inner-rect">
                <img src={PlusIcon} alt="Icon" className="works-rect-icon" />
              </div>
            </div>
          </div>

          <div className="feature-item reveal animate-scale-in animation-delay-400">
            <div className="works-icon">2</div>
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

          <div className="feature-item reveal animate-slide-in-right animation-delay-600">
            <div className="works-icon">3</div>
            <h3>Vote & Plan</h3>
            <p>Everyone votes on activities. The best option wins automatically.</p>
            <div className="works-outer-rect hover-lift">
              <div className="works-inner-rect">
                <img src={CheckmarkIcon} alt="Icon" className="works-rect-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
