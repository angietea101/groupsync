import Navbar from '../components/Navbar';
import AvailabilityPicker from '../components/AvailabilityPicker';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import './PlanEvent.css';

export default function PlanEvent() {
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

  return (
    <>
      <Navbar />
      <div className="createevent-page">
        <div className="createevent-header">
          <div>
            <h1>Hangout #1</h1>
            <div className="event-info">
              <Calendar size={16} />
              May 18 - May 25 · 5 invited
            </div>
          </div>
          <button className="invite-button">Invite Friends</button>
        </div>

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
