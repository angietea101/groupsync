import { Link } from 'react-router-dom';
import './PlanEvent.css';
import Navbar from '../components/Navbar';
import DateRangePicker from '../components/DateRangePicker';
import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function PlanEvent() {
  const [eventDates, setEventDates] = useState({
    startDate: null,
    endDate: null,
    dates: [],
  });

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const modalRef = useRef(null);

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

  return (
    <>
      <Navbar />
      <div className="createevent-page">
        <div className="createevent-container">
          <h1 className="title">Create a New Event</h1>
          <p className="subtitle">Plan your perfect gathering.</p>
          <div className="createevent-card">
            <form className="form">
              <div>
                <label>
                  Event Name <span className="required">*</span>
                </label>
                <input type="text" required placeholder="E.g., Weekend Hike" />
              </div>

              <div>
                <label>
                  Description <span className="optional">(optional)</span>
                </label>
                <textarea placeholder="Add more details about the event..."></textarea>
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

                <input
                  type="hidden"
                  name="eventDates"
                  required
                  value={JSON.stringify(eventDates)}
                />
              </div>

              <button type="submit" className="createevent-btn">
                Create Group
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
