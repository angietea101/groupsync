import React from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SignIn() {
  return (
    <div className="home-container">
      {/* NAVBAR */}
      <Navbar />
      <h3>Sign In Page</h3>
    </div>
  );
}
