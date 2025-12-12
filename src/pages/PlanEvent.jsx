import Navbar from '../components/Navbar';
import AvailabilityPicker from '../components/AvailabilityPicker';
import { useState } from 'react';
import { Calendar, ChevronDown, UsersRound } from 'lucide-react';
import './PlanEvent.css';

export default function PlanEvent() {
  const [showDescription, setShowDescription] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleClick = (e) => {
    const btn = e.currentTarget;

    // Trigger flash animation
    btn.classList.remove('flash');
    void btn.offsetWidth;
    btn.classList.add('flash');

    // Change text
    setCopied(true);

    // Reset text after 1s
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="createevent-page">
        {/* Header: left = title + description, right = date row + invite */}
        <div className="createevent-header">
          <div className="header-left">
            <h1>Hangout #1</h1>

            <div
              className="description-toggle"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span className="description-label">Description</span>
              <ChevronDown size={16} className={`chevron ${showDescription ? 'open' : ''}`} />
            </div>

            <div className={`description-content ${showDescription ? 'open' : ''}`}>
              Planning our first hangout for the group! Add your availability and suggest
              activities.
            </div>

            {/* NEW: date + invite button together, under description */}
            <div className="date-invite-row">
              <div className="event-info">
                <Calendar />
                <span className="event-info-text">May 18 - May 25 ·</span>
                <UsersRound />
                <span> {invited.length} invited</span>
              </div>
              <button className="invite-button" onClick={handleClick}>
                {copied ? 'Copied' : 'Invite Friends'}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="createevent-body">
          <div className="availability-section">
            <h3>Availability</h3>
            <AvailabilityPicker dates={eventDates} startTime={9} endTime={20.5} />
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
