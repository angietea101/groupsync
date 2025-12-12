import Navbar from '../components/Navbar';
import AvailabilityPicker from '../components/AvailabilityPicker';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ChevronDown, UsersRound, Link2 } from 'lucide-react';
import { getEvent } from '../services/firebaseService';
import './PlanEvent.css';

export default function PlanEvent() {
  const { eventId } = useParams();

  const [showDescription, setShowDescription] = useState(true);
  const [copied, setCopied] = useState(false);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [eventDates] = useState([
    '2025-12-11',
    '2025-12-13',
    '2025-12-14',
    '2025-12-16',
    '2025-12-18',
    '2025-12-20',
  ]);
  const [votes] = useState([
    { name: 'Hiking at Griffith Park', count: 4 },
    { name: 'Brunch at AVE Sushi', count: 3 },
  ]);
  const [invited] = useState(['Ruben', 'Angie', 'Diego', 'Sonia']);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const eventData = await getEvent(eventId);
        setEvent(eventData);
      } catch (err){
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleClick = (e) => {
    const btn = e.currentTarget;

    // Trigger flash animation
    btn.classList.remove('flash');
    void btn.offsetWidth;
    btn.classList.add('flash');

    // copy link to clipboard
    const link = `${window.location.origin}/planevent/${eventId}`;
    navigator.clipboard.writeText(link);

    // Change text
    setCopied(true);

    // Reset text after 1s
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const formatDateRange = () => {
    if (!event?.dates || event.dates.length === 0) return '';

    const dates = event.dates.sort();
    const firstDate = new Date(dates[0] + 'T00:00:00');
    const lastDate = new Date(dates[dates.length - 1] + 'T00:00:00');

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return `${formatDate(firstDate)} - ${formatDate(lastDate)}`
  };

  if (loading) {
    return (
      <>
      <Navbar />
      <div className="createevent=page">
        <p>Loading event...</p>
      </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Navbar />
        <div className="createevent-page">
          <p className="error-msg">{error}</p>
        </div>
      </>
    );
  }
  if (!event) {
    return (
      <>
        <Navbar />
        <div className="createevent-page">
          <p>Event not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="createevent-page">
        {/* Header: left = title + description, right = date row + invite */}
        <div className="createevent-header">
          <div className="header-left">
            <h1>{event.title}</h1>

            {event.description && (
              <>
                <div
                  className="description-toggle"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  <span className="description-label">Description</span>
                  <ChevronDown size={16} className={`chevron ${showDescription ? 'open' : ''}`} />
                </div>

                <div className={`description-content ${showDescription ? 'open' : ''}`}>
                  {event.description}
                </div>
              </>
            )}

            {/* NEW: date + invite button together, under description */}
            <div className="date-invite-row">
              <div className="event-info">
                <Calendar />
                <span className="event-info-text">{formatDateRange()} ·</span>
                <UsersRound />
                <span> {invited.length} invited</span>
              </div>
              <button className="invite-button" onClick={handleClick}>
                <Link2 />
                {copied ? 'Copied' : 'Copy Invite Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="createevent-body">
          <div className="availability-section">
            <h3>Availability</h3>
            <AvailabilityPicker dates={event.dates} startTime={9} endTime={20.5} />
          </div>

          <div className="activity-poll-section">
            <h3>Activity Poll</h3>
            {votes.map((vote, i) => (
              <div key={i} className="activity-poll-item">
                <span>{vote.name}</span>
                <div className="activity-poll-bar" style={{ width: `${vote.count * 20}%` }} />
                <small>{vote.count} votes</small>
              </div>
            ))}
            <input type="text" placeholder="Suggest an activity..." className="activity-input" />
          </div>
        </div>

        <div className="footer-responded">
          RESPONDED:
          {invited.map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>
    </>
  );
}
