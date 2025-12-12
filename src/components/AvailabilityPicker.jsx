import React, { useState, useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import './AvailabilityPicker.css';

const TIME_SLOT_MINUTES = 30;

const formatTimeLabel = (hour, minute) => {
  return moment().hour(hour).minute(minute).format('H:mm');
};

const formatDayName = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD').format('ddd');
};

const AvailabilityPicker = ({
  dates,
  startTime = 9,
  endTime = 20,
  slotDuration = TIME_SLOT_MINUTES,
  initialAvailability = {},
  onSave,
}) => {
  const [availability, setAvailability] = useState(initialAvailability);

  useEffect(() => {
    if (Object.keys(initialAvailability).length > 0) {
      setAvailability(initialAvailability);
    }
  }, [initialAvailability]);

  const [isDragging, setIsDragging] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const timeSlots = useMemo(() => {
    const slots = [];
    let currentHour = startTime;
    let currentMinute = 0;

    while (currentHour * 60 + currentMinute < endTime * 60) {
      slots.push(formatTimeLabel(currentHour, currentMinute));
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute %= 60;
      }
    }
    return slots;
  }, [startTime, endTime, slotDuration]);

  const isSlotSelected = useCallback(
    (date, slot) => {
      return availability[date] && availability[date].includes(slot);
    },
    [availability]
  );

  const toggleSlot = useCallback((date, slot) => {
    setAvailability((prev) => {
      const currentSlots = prev[date] ? [...prev[date]] : [];
      const index = currentSlots.indexOf(slot);

      if (index > -1) {
        currentSlots.splice(index, 1);
      } else {
        currentSlots.push(slot);
        currentSlots.sort((a, b) => {
          const timeA = moment(a, 'H:mm');
          const timeB = moment(b, 'H:mm');
          return timeA.diff(timeB);
        });
      }

     const newState = {
        ...prev,
      };

      if (currentSlots.length > 0) {
        newState[date] = currentSlots;
      } else {
        delete newState[date];
      }

      return newState;
    });
  }, []);

  // Mouse Events for Drag and Click functionality :D

  const handleMouseDown = useCallback(
    (date, slot) => {
      const currentlySelected = isSlotSelected(date, slot);
      setIsSelecting(!currentlySelected);

      toggleSlot(date, slot);
      setIsDragging(true);
    },
    [isSlotSelected, toggleSlot]
  );

  const handleMouseEnter = useCallback(
    (date, slot) => {
      if (isDragging) {
        setAvailability((prev) => {
          const currentSlots = prev[date] ? [...prev[date]] : [];
          const index = currentSlots.indexOf(slot);
          let newSlots = [...currentSlots];

          if (isSelecting && index === -1) {
            newSlots.push(slot);
          } else if (!isSelecting && index > -1) {
            newSlots.splice(index, 1);
          } else {
            return prev;
          }

          newSlots.sort((a, b) => moment(a, 'H:mm').diff(moment(b, 'H:mm')));

          const newState = {
            ...prev,
          };

          if (newSlots.length > 0) {
            newState[date] = newSlots;
          } else {
            delete newState[date];
          }

          return newState;
        });
      }
    },
    [isDragging, isSelecting]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      if (onSave) {
        onSave(availability);
      }
    }
  }, [isDragging, availability, onSave]);

  React.useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const TimeAxis = useMemo(
    () => (
      <div className="time-axis">
        {timeSlots.map((time, index) => {
          const [h, m] = time.split(':').map(Number);
          const isFullHour = m === 0;

          return (
            <div key={time} className={`time-slot-label ${isFullHour ? 'full-hour' : 'half-hour'}`}>
              {isFullHour && (
                <div className="label-text">{moment(time, 'H:mm').format('HH:mm')}</div>
              )}
              <div className="separator" />
            </div>
          );
        })}
      </div>
    ),
    [timeSlots]
  );

  return (
    <div className="availability-picker-wrapper">
      <div className="availability-picker-card">
        <div className="picker-container">
          <div className="day-header-row">
            <div className="day-header empty-cell">Time</div>
            {dates.map((date) => (
              <div key={date} className="day-header">
                <span className="day-name">{formatDayName(date)}</span>
                <span className="date-number">{moment(date).format('D')}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {TimeAxis}
            {dates.map((date) => (
              <div key={date} className="date-column">
                {timeSlots.map((slot) => {
                  const isSelected = isSlotSelected(date, slot);
                  return (
                    <div
                      key={slot}
                      className={`time-slot ${isSelected ? 'selected' : 'unselected'}`}
                      onMouseDown={() => handleMouseDown(date, slot)}
                      onMouseEnter={() => handleMouseEnter(date, slot)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="click-instruction">Click and drag to add your time.</div>
    </div>
  );
};

export default AvailabilityPicker;
