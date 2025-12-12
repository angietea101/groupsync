import { Link, useNavigate } from 'react-router-dom';
import './CreatePlan.css';
import Navbar from '../components/Navbar';
import DateRangePicker from '../components/DateRangePicker';
import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { createEvent } from '../services/firebaseService';

export default function PlanEvent() {
  const navigate = useNavigate();

  const [eventName, setEventaName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDates, setEventDates] = useState({
    startDate: null,
    endDate: null,
    dates: [],
  });

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!eventName.trim()) {
      setError('Please enter an event name');
      return;
    }

    if (!eventDates.dates || eventDates.dates.length === 0) {
      setError('Please select at least one date');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const eventId = await createEvent({
        title: eventName,
        description: description,
        dates: eventDates.dates,
      });

      navigate(`/planevent/${eventId}`);
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Navbar />
      <div className="createplan-page">
        <div className="createplan-container">
          <h1 className="title">Create a New Plan</h1>
          <p className="subtitle">Plan your perfect gathering.</p>
          <div className="createplan-card">
            <form className="form" onSubmit={handleSubmit}>
              <div>
                <label>
                  Event Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Weekend Hike"
                  value={eventName}
                  onChange={(e) => setEventaName(e.target.value)}
                />
              </div>

              <div>
                <label>
                  Description <span className="optional">(optional)</span>
                </label>
                <textarea
                  placeholder="Add more details about the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="date-picker-wrapper">
                <div className="date-picker-wrapper">
                  <label>
                    Event Dates <span className="required">*</span>
                  </label>

                  <div className="date-input-display" onClick={() => setShowPicker(true)}>
                    <span className={eventDates.startDate ? 'filled' : 'placeholder'}>
                      {eventDates.startDate
                        ? `${eventDates.startDate} → ${eventDates.endDate}`
                        : 'Select Your Dates'}
                    </span>
                    <Calendar size={18} className="calendar-icon" />
                  </div>

                  <input
                    type="hidden"
                    name="eventDates"
                    required
                    value={JSON.stringify(eventDates)}
                  />
                </div>
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="createplan-btn" disabled={loading}>
                {loading ? 'Creating Event...' : 'Next'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {showPicker && (
        <>
          <div className="datepicker-modal" ref={pickerRef}>
            <DateRangePicker
              initialDates={eventDates.dates}
              onChange={(newDates) => setEventDates(newDates)}
            />
          </div>
        </>
      )}
    </>
  );
}
