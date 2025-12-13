import React, { useMemo } from 'react';
import moment from 'moment';
import './GroupAvailabilityView.css';

const TIME_SLOT_MINUTES = 30;

const formatTimeLabel = (hour, minute) => {
  return moment().hour(hour).minute(minute).format('H:mm');
};

const formatDayName = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD').format('ddd');
};

const GroupAvailabilityView = ({
  dates,
  startTime = 9,
  endTime = 20,
  slotDuration = TIME_SLOT_MINUTES,
  participants = [],
}) => {
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

  const getSlotCount = useMemo(() => {
    const slotCounts = {};

    dates.forEach((date) => {
      slotCounts[date] = {};
      timeSlots.forEach((slot) => {
        slotCounts[date][slot] = 0;
      });
    });

    participants.forEach((particapnt) => {
      if (particapnt.availability) {
        Object.entries(particapnt.availability).forEach(([date, slots]) => {
          if (slotCounts[date]) {
            slots.forEach((slot) => {
              if (slotCounts[date][slot] !== undefined) {
                slotCounts[date][slot]++;
              }
            });
          }
        });
      }
    });

    return slotCounts;
  }, [dates, timeSlots, participants]);

  const maxParticipants = participants.length || 1;

  const getHeatmapColor = (count) => {
    if (count === 0) return 'var(--color-light-gray-picker)';

    const intensity = count / maxParticipants;

    if (intensity === 1) return '#da7756';
    if (intensity >= 0.75) return '#D98E75';
    if (intensity >= 0.5) return '#D49C87';
    if (intensity >= 0.25) return '#DDAC9C';
    return '#FCE4DC';
  };

  const TimeAxis = useMemo(
    () => (
      <div className="time-axis">
        {timeSlots.map((time) => {
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
    <div className="group-availability-wrapper">
      <div className="group-availability-card">
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
                  const count = getSlotCount[date]?.[slot] || 0;
                  const backgroundColor = getHeatmapColor(count);

                  return (
                    <div
                      key={slot}
                      className={`group-time-slot ${count === 0 ? 'empty' : ''}`}
                      style={{ backgroundColor }}
                      title={`${count} / ${maxParticipants} available`}
                    >
                      {count > 0 && <span className="slot-count">{count}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="heatmap-legend">
          <span className="legend-label">Fewer</span>
          <div className="legend-gradient">
            <div style={{ backgroundColor: '#FCE4DC' }} />
            <div style={{ backgroundColor: '#DDAC9C' }} />
            <div style={{ backgroundColor: '#D49C87' }} />
            <div style={{ backgroundColor: '#D98E75' }} />
            <div style={{ backgroundColor: '#da7756' }} />
          </div>
          <span className="legend-label">More</span>
        </div>
      </div>

      <div className="view-instruction">
        Viewing group availability ({participants.length}{' '}
        {participants.length === 1 ? 'person' : 'people'})
      </div>
    </div>
  );
};

export default GroupAvailabilityView;
