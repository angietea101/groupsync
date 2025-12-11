import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DateRangePicker.css';

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function DateRangePicker({ initialDates = [], onChange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set(initialDates));

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);

  const changeMonth = (delta) => {
    setCurrentMonth((prev) => {
      const clone = new Date(prev);
      clone.setMonth(clone.getMonth() + delta);
      return clone;
    });
  };

  const handleMouseDown = useCallback(
    (dateString) => {
      setIsDragging(true);

      const mode = selectedDates.has(dateString) ? 'deselect' : 'select';
      setDragMode(mode);

      const newDates = new Set(selectedDates);
      if (mode === 'select') newDates.add(dateString);
      else newDates.delete(dateString);

      setSelectedDates(newDates);
      const sorted = Array.from(newDates).sort();
      const start = sorted[0] || null;
      const end = sorted[sorted.length - 1] || null;

      onChange?.({
        startDate: start,
        endDate: end,
        dates: sorted,
      });
    },
    [selectedDates, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragMode(null);
  }, []);

  const handleMouseEnter = useCallback(
    (dateString) => {
      if (!isDragging || !dragMode) return;

      const newDates = new Set(selectedDates);

      if (dragMode === 'select') newDates.add(dateString);
      else newDates.delete(dateString);

      setSelectedDates(newDates);
      const sorted = Array.from(newDates).sort();
      const start = sorted[0] || null;
      const end = sorted[sorted.length - 1] || null;

      onChange?.({
        startDate: start,
        endDate: end,
        dates: sorted,
      });
    },
    [isDragging, dragMode, selectedDates, onChange]
  );

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstIndex = (firstDay.getDay() + 6) % 7;

    const days = [];

    const prevLast = new Date(year, month, 0).getDate();
    for (let i = firstIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevLast - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    return days;
  };

  const calendarDays = useMemo(getCalendarDays, [currentMonth]);

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button className="nav-button" onClick={() => changeMonth(-1)}>
          <ChevronLeft size={20} />
        </button>
        <h3 className="month-name">{monthName}</h3>
        <button className="nav-button" onClick={() => changeMonth(1)}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of week */}
      <div className="days-of-week-grid">
        {daysOfWeek.map((d) => (
          <span key={d} className="day-of-week">
            {d}
          </span>
        ))}
      </div>

      {/* Day Grid */}
      <div
        className="days-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
      >
        {calendarDays.map((dayObj, i) => {
          const dateString = formatDate(dayObj.date);
          const isSelected = selectedDates.has(dateString);

          let className = 'day-cell';
          if (!dayObj.isCurrentMonth) className += ' other-month';
          if (isSelected) className += ' selected';

          return (
            <div
              key={i}
              className={className}
              onMouseDown={() => handleMouseDown(dateString)}
              onMouseEnter={() => handleMouseEnter(dateString)}
            >
              {dayObj.date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="info">{selectedDates.size} selected</div>
    </div>
  );
}
