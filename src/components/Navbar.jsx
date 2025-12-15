import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { Menu, X, User, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // redirect after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

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
          <Link to="/team">Team</Link>
        </div>

        <div className="navbar-right desktop-only">
          {authLoading ? (
            <div style={{ height: '40px', width: '160px' }} />
          ) : !user ? (
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
              <Link to="/viewplans" className="sign-in">
                View Plans
              </Link>
              <Link to="/createplan">
                <button className="get-started">Create Plan</button>
              </Link>
              {/* User Dropdown */}
              <div className="dropdown-container" ref={dropdownRef}>
                <button
                  className="avatar-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="User menu"
                >
                  <span className="avatar-initials">{getUserInitials()}</span>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.displayName || 'User'}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
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
          <Link to="/team" onClick={closeMobileMenu}>
            Team
          </Link>
        </div>

        <div className="mobile-auth">
          {!authLoading &&
            (!user ? (
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
                <Link to="/viewplans" className="mobile-link" onClick={closeMobileMenu}>
                  View Plans
                </Link>
                <Link to="/createplan" onClick={closeMobileMenu}>
                  <button className="get-started mobile-btn">Create Plan</button>
                </Link>

                {/* User Info Row with Logout */}
                <div className="mobile-user-row">
                  <div className="mobile-user-info-compact">
                    <div className="mobile-avatar-small">
                      <span className="avatar-initials">{getUserInitials()}</span>
                    </div>
                    <div className="mobile-user-details-compact">
                      <div className="mobile-user-name">{user.displayName || 'User'}</div>
                      <div className="mobile-user-email">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="mobile-logout-compact"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>
    </nav>
  );
}
