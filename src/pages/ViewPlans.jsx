import { useState, useEffect } from 'react';
import './ViewPlans.css';
import Navbar from '../components/Navbar';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { getUserEvents } from '../services/firebaseService';

export default function ViewPlans() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Current Plans');
  const [loading, setLoading] = useState(true);
  const [currentPlans, setCurrentPlans] = useState([]);
  const [pastPlans, setPastPlans] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchEvents = async () => {
      console.log(user);
      if (user) {
        try {
          const events = await getUserEvents(user.uid);
          console.log(events);
          processEvents(events);
        } catch (err) {
          console.error('Error fetching events: ', err);
        }
      }
      setLoading(false);
    };
    fetchEvents();
  }, [user]);

  const processEvents = (events) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const current = [];
    const past = [];

    events.forEach((event) => {
      let endDate = null;

      if (event.dates && event.dates.length > 0) {
        const sortedDates = [...event.dates].sort();
        endDate = new Date(sortedDates[sortedDates.length - 1]);
      }

      if (endDate && endDate < today) {
        past.push(event);
      } else {
        current.push(event);
      }
    });

    setCurrentPlans(current);
    setPastPlans(past);
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // redirect after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDateRange = (dates) => {
    if (!dates || dates.length === 0) return 'TBD';
    const sorted = [...dates].sort();
    const start = new Date(sorted[0]);
    const end = new Date(sorted[sorted.length - 1]);

    const options = { month: 'long', day: 'numeric' };

    if (sorted.length === 1 || start.getTime() === end.getTime()) {
      return start.toLocaleDateString('en-US', options);
    }

    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const handlePlanClick = (planId) => {
    navigate(`/planevent/${planId}`);
  };

  const handleCreatePlan = () => {
    navigate('/createplan');
  };
  const plansDisplay = activeTab === 'Current Plans' ? currentPlans : pastPlans;

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
          <button
            className={`toggle-btn ${activeTab === 'Current Plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('Current Plans')}
          >
            Current Plans
          </button>
          <button
            className={`toggle-btn ${activeTab === 'Past Plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('Past Plans')}
          >
            Past Plans
          </button>
        </div>

        {/* Plans List */}
        <div className="plans-list">
          {loading ? (
            <p>Loading plans...</p>
          ) : plansDisplay.length === 0 ? (
            <div className="no-plans">
              <p>No {activeTab.toLowerCase()} found.</p>
            </div>
          ) : (
            plansDisplay.map((plan) => (
              <div
                key={plan.id}
                className="plan-card"
                onClick={() => handlePlanClick(plan.id)}
                style={{ cursor: 'pointer' }}
              >
                <h3 className="plan-title">{plan.title}</h3>
                <p className="plan-date">{formatDateRange(plan.dates)}</p>
                <p className="plan-desc">
                  <strong>Description:</strong>
                  <br />
                  {plan.description || 'No description provided.'}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Floating Add Button */}
        <button className="floating-add-btn" onClick={() => handleCreatePlan()}>
          +
        </button>
      </div>
    </>
  );
}
