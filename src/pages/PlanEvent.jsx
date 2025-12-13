import Navbar from '../components/Navbar';
import NameInputModal from '../components/NameInputModal';
import AvailabilityPicker from '../components/AvailabilityPicker';
import GroupAvailabilityView from '../components/GroupAvailabilityView';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ChevronDown, UsersRound, Link2, Heart, Plus, Eye, Edit3 } from 'lucide-react';
import {
  getEvent,
  getEventParticipants,
  addParticipant,
  updateAvailability,
  getEventActivities,
  addActivity,
  voteForActivity,
  removeVoteFromActivity,
} from '../services/firebaseService';
import './PlanEvent.css';
import { auth } from '../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlanEvent() {
  const { eventId } = useParams();

  const [showDescription, setShowDescription] = useState(true);
  const [copied, setCopied] = useState(false);

  const [viewMode, setViewMode] = useState('edit');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentParticipantId, setCurrentParticipantId] = useState(null);
  const [myAvailability, setMyAvailability] = useState({});

  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  // modal state for guest users :D
  const [showNameModal, setShowNameModal] = useState(false);
  const [guestName, setGuestName] = useState('');

  const [participants, setParticipants] = useState([]);

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
    async function initPage() {
      try {
        setLoading(true);
        const eventData = await getEvent(eventId);
        setEvent(eventData);

        const allParticiapants = await getEventParticipants(eventId);
        setParticipants(allParticiapants);

        const user = auth.currentUser;

        if (user) {
          const participants = await getEventParticipants(eventId);
          const foundParticipant = participants.find((p) => p.userId === user.uid);

          if (foundParticipant) {
            setCurrentParticipantId(foundParticipant.id);
            setMyAvailability(foundParticipant.availability || {});
          } else {
            const newId = await addParticipant(eventId, {
              name: user.displayName || 'Anonymous User',
            });
            setCurrentParticipantId(newId);
            setMyAvailability({});

            const updatedParticipants = await getEventParticipants(eventId);
            setParticipants(updatedParticipants);
          }
          setCurrentUserName(user.displayName || foundParticipant?.name || 'Anonymous');
        } else {
          // for when user is not logged in :D
          const savedName = localStorage.getItem(`guest_name_${eventId}`);
          const savedParticipantId = localStorage.getItem(`guest_participant_${eventId}`);

          if (savedName && savedParticipantId) {
            setGuestName(savedName);
            setCurrentUserName(savedName);
            setCurrentParticipantId(savedParticipantId);

            const participants = await getEventParticipants(eventId);
            const foundParticipant = participants.find((p) => p.id === savedParticipantId);
            if (foundParticipant) {
              setMyAvailability(foundParticipant.availability || {});
            }
          } else {
            setShowNameModal(true);
          }
        }

        const fetchedActivities = await getEventActivities(eventId);
        setActivities(sortActivitiesByVotes(fetchedActivities));
      } catch (err) {
        console.error('Error loading event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      initPage();
    }
  }, [eventId]);

  const handleNameSubmit = async (name) => {
    try {
      const newId = await addParticipant(eventId, { name });

      setGuestName(name);
      setCurrentUserName(name);
      setCurrentParticipantId(newId);
      setMyAvailability({});

      localStorage.setItem(`guest_name_${eventId}`, name);
      localStorage.setItem(`guest_participant_${eventId}`, newId);

      const updatedParticipants = await getEventParticipants(eventId);
      setParticipants(updatedParticipants);

      setShowNameModal(false);
    } catch (err) {
      console.error('Failed to add guest participant', err);
      alert('Failed to join the event :C Try again maybe idk.');
    }
  };

  const handleAvailabilitySave = async (newAvailability) => {
    if (!currentParticipantId) {
      alert('You must be logged in to save availability.');
      return;
    }

    try {
      setMyAvailability(newAvailability);

      await updateAvailability(eventId, currentParticipantId, newAvailability);
      console.log('Availability saved to Firestore!');

      const updatedParticipants = await getEventParticipants(eventId);
      setParticipants(updatedParticipants);
    } catch (err) {
      console.error('Failed to save availability:', err);
    }
  };

  const handleActivitySuggest = async (e) => {
    if (e.key !== 'Enter' || newActivity.trim() === '') return;

    try {
      const activityId = await addActivity(eventId, {
        title: newActivity.trim(),
        suggestedBy: currentUserName,
      });

      setActivities((prev) =>
        sortActivitiesByVotes([
          ...prev,
          {
            id: activityId,
            title: newActivity.trim(),
            suggestedBy: currentUserName,
            count: 0,
            votes: [],
          },
        ])
      );

      setNewActivity('');
    } catch (err) {
      console.error('Failed to suggest activity:', err);
    }
  };

  const handleVote = async (activityId, currentVotes) => {
    if (!currentUserName || currentUserName === 'Anonymous') {
      alert('please ensure your name is set before voting');
      return;
    }

    const isVoted = currentVotes.includes(currentUserName);

    try {
      if (isVoted) {
        await removeVoteFromActivity(eventId, activityId, currentUserName);

        setActivities((prev) =>
          sortActivitiesByVotes(
            prev.map((activity) => {
              if (activity.id === activityId) {
                return {
                  ...activity,
                  count: activity.count - 1,
                  votes: activity.votes.filter((name) => name !== currentUserName),
                  justVoted: true,
                };
              }
              return activity;
            })
          )
        );
      } else {
        await voteForActivity(eventId, activityId, currentUserName);

        setActivities((prev) =>
          sortActivitiesByVotes(
            prev.map((activity) => {
              if (activity.id === activityId) {
                return {
                  ...activity,
                  count: activity.count + 1,
                  votes: [...activity.votes, currentUserName],
                  justVoted: true,
                };
              }
              return activity;
            })
          )
        );
      }
      setTimeout(() => {
        setActivities((prev) =>
          prev.map((activity) => {
            if (activity.id === activityId) {
              const { justVoted, ...rest } = activity;
              return rest;
            }
            return activity;
          })
        );
      }, 300);
    } catch (err) {
      console.error('Failed to update vote:', err);
    }
  };

  const sortActivitiesByVotes = (activitiesArray) => {
    return [...activitiesArray].sort((a, b) => b.count - a.count);
  };

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

    return `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
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
      <NameInputModal isOpen={showNameModal} onSubmit={handleNameSubmit} />
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
            <div className="availability-header">
              <h3>Availability</h3>
              <button
                className="toggle-view-button"
                onClick={() => setViewMode(viewMode === 'edit' ? 'view' : 'edit')}
              >
                {viewMode === 'edit' ? (
                  <>
                    <Eye size={18} />
                    View Group
                  </>
                ) : (
                  <>
                    <Edit3 size={18} />
                    Edit Mine
                  </>
                )}
              </button>
            </div>

            {viewMode === 'edit' ? (
              <AvailabilityPicker
                dates={event.dates}
                startTime={9}
                endTime={20.5}
                initialAvailability={myAvailability}
                onSave={handleAvailabilitySave}
              />
            ) : (
              <GroupAvailabilityView
                dates={event.dates}
                startTime={9}
                endTime={20.5}
                participants={participants}
              />
            )}
          </div>

          <div className="activity-poll-section">
            <h3>Activity Poll</h3>
            {/* The 'activities' state will now hold the fetched data */}
            <AnimatePresence>
              {activities.map((activity) => {
                const isVoted = activity.votes.includes(currentUserName);
                const maxVotes = Math.max(1, ...activities.map((a) => a.count));

                return (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className={`activity-poll-item ${isVoted ? 'voted' : ''} ${activity.justVoted ? 'just-voted' : ''}`}
                  >
                    <div className="activity-poll-info">
                      <span className="activity-title">{activity.title}</span>
                      <div className="activity-poll-bar-container">
                        <div
                          className="activity-poll-bar"
                          style={{ width: `${(activity.count / maxVotes) * 100}%` }}
                        />
                      </div>
                      <small>{activity.count} votes</small>
                    </div>

                    <button
                      className={`vote-button ${isVoted ? 'voted' : ''}`}
                      onClick={() => handleVote(activity.id, activity.votes)}
                      aria-label={isVoted ? 'Remove vote' : 'Vote for this activity'}
                    >
                      <Heart size={20} fill={isVoted ? 'currentColor' : 'none'} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Suggestion Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Suggest an activity..."
                className="activity-input"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={handleActivitySuggest}
              />
              <button
                className="add-activity-button"
                onClick={() => {
                  if (newActivity.trim()) {
                    handleActivitySuggest({ key: 'Enter' });
                  }
                }}
                aria-label="Add activity"
              >
                <Plus size={25} />
              </button>
            </div>
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
