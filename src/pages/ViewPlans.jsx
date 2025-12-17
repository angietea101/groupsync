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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchEvents(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEvents = async (uid) => {
    try {
      const events = await getUserEvents(uid);
      console.log(events);
      processEvents(events);
    } catch (err) {
      console.error('Error fetching events: ', err);
    } finally {
      setLoading(false);
    }
  };

  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day);
  };

  const processEvents = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = [];
    const past = [];

    events.forEach((event) => {
      let endDate = null;

      if (event.dates && event.dates.length > 0) {
        const sortedDates = [...event.dates].sort();
        endDate = parseLocalDate(sortedDates[sortedDates.length - 1]);
      }

      if (endDate && endDate < today) {
        past.push(event);
      } else {
        current.push(event);
      }
    });

    const sortByCreatedAt = (a, b) => {
      const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
      const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
      return dateB - dateA;
    };

    current.sort(sortByCreatedAt);
    past.sort(sortByCreatedAt);

    setCurrentPlans(current);
    setPastPlans(past);
  };

  const formatDateRange = (dates) => {
    if (!dates || dates.length === 0) return 'TBD';
    const sorted = [...dates].sort();
    const start = parseLocalDate(sorted[0]);
    const end = parseLocalDate(sorted[sorted.length - 1]);

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
