import React from 'react';
import './ViewPlans.css';
import Navbar from '../components/Navbar';
import { auth } from '../services/firebase';

export default function ViewPlans() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // redirect after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <Navbar />
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          marginTop: '20px',
          padding: '10px 16px',
          borderRadius: '8px',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          marginLeft: '15px',
        }}
      >
        Log Out
      </button>
      <div className="plans-page">
        {/* Toggle Buttons */}
        <div className="plans-toggle">
          <button className="toggle-btn">Current Plans</button>
          <button className="toggle-btn">Past Plans</button>
        </div>

        {/* Plans List */}
        <div className="plans-list">
          <div className="plan-card">
            <h3 className="plan-title">Hangout #1</h3>
            <p className="plan-date">May 18 – May 25</p>
            <p className="plan-desc">
              <strong>Description:</strong>
              <br />
              It will be fun!
            </p>
          </div>

          <div className="plan-card">
            <h3 className="plan-title">Spring Getaway</h3>
            <p className="plan-date">April 20 – April 29</p>
            <p className="plan-desc">
              <strong>Description:</strong>
              <br />
              Relax from school and party hehe
            </p>
          </div>
        </div>

        {/* Floating Add Button */}
        <button className="floating-add-btn">+</button>
      </div>
    </>
  );
}
