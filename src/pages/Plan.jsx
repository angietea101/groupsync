import Navbar from '../components/Navbar';
import DateRangePicker from '../components/DateRangePicker';
import { useState } from 'react';
import AvailabilityPicker from '../components/AvailabilityPicker';
const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Plan() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const handleDateRangeChange = (range) => {
    if (!range) return;

    setDateRange({
      startDate: range.startDate,
      endDate: range.endDate,
      dates: range.dates
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Data:', {
      eventName,
      description,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dates: dateRange.dates
    });
  };
  const displayDateRange =
    dateRange.startDate && dateRange.endDate
      ? `${formatDisplayDate(dateRange.startDate)} to ${formatDisplayDate(dateRange.endDate)}`
      : '';
  const eventDates = ['2025-12-11', '2025-12-13', '2025-12-14', '2025-12-16', '2025-12-18' ,'2025-12-20'];
  return (
    <>
      <Navbar />
      <div style={{ padding: 40 }}>
        <h1>Welcome to Plan Page</h1>
        <div>
          <label>Event Dates *</label>
          <input
            id="eventDates"
            type="text"
            value={displayDateRange}
            onFocus={() => setIsCalendarOpen(true)}
            readOnly
          />
          <p className="helper-text">This is the period your group will pick availability from</p>
          {isCalendarOpen && (
            <div>
              <DateRangePicker onChange={handleDateRangeChange} />
            </div>
          )}
        </div>
        <button onClick={() => console.log(dateRange)}>
          Log Selected Dates
        </button>
        <div className="home-container">
            <AvailabilityPicker 
                dates={eventDates} 
                startTime={9} 
                endTime={20.5}
            />
        </div>
      </div>
    </>
  );
}
