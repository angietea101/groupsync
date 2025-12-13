import Navbar from '../components/Navbar';
import AvailabilityPicker from '../components/AvailabilityPicker';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ChevronDown, UsersRound, Link2 } from 'lucide-react';
import { getEvent, getEventParticipants, addParticipant, updateAvailability, getEventActivities, addActivity, voteForActivity } from '../services/firebaseService';
import './PlanEvent.css';
import { auth } from '../services/firebase';
export default function PlanEvent() {
  const { eventId } = useParams();

  const [showDescription, setShowDescription] = useState(true);
  const [copied, setCopied] = useState(false);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentParticipantId, setCurrentParticipantId] = useState(null);
  const [myAvailability, setMyAvailability] = useState({});

  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

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

        const user = auth.currentUser;
        
        if (user) {
            const participants = await getEventParticipants(eventId);
            const foundParticipant = participants.find(p => p.userId === user.uid);

            if (foundParticipant) {
                setCurrentParticipantId(foundParticipant.id);
                setMyAvailability(foundParticipant.availability || {});
            } else {
                // If user is new to this event, add them immediately (this is where we can implement logic to ask for users name)
                const newId = await addParticipant(eventId, {
                    name: user.displayName || 'Anonymous User'
                });
                setCurrentParticipantId(newId);
                setMyAvailability({});
            }
            setCurrentUserName(user.displayName || foundParticipant?.name || 'Anonymous')
        }

        const fetchedActivities = await getEventActivities(eventId);
        setActivities(fetchedActivities);
      } catch (err){
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

  const handleAvailabilitySave = async (newAvailability) => {
    if (!currentParticipantId) {
        alert("You must be logged in to save availability.");
        return;
    }

    try {
        setMyAvailability(newAvailability);
        
        await updateAvailability(eventId, currentParticipantId, newAvailability);
        console.log("Availability saved to Firestore!");
    } catch (err) {
        console.error("Failed to save availability:", err);
    }
  };

  const handleActivitySuggest = async(e) => {
    if (e.key !== 'Enter' || newActivity.trim() === '') return;

    try {
      const activityId = await addActivity(eventId, {
        title: newActivity.trim(),
        suggestedBy: currentUserName,
      });

      setActivities(prev => [...prev, {
        id: activityId,
        title: newActivity.trim(),
        suggestedBy: currentUserName,
        count: 0,
        votes: [],
      }]);

      setNewActivity('')
    } catch (err) {
      console.error('Failed to suggest activity:', err);
    }
  };

  const handleVote = async (activityId, currentVotes) => {
    if (!currentUserName || currentUserName === 'Anonymous') {
      alert("please ensure your name is set before voting");
      return;
    }
    if (currentVotes.includes(currentUserName)) {
      alert("You have already voted for this activity");
      return;
    }

    try {
      await voteForActivity(eventId, activityId, currentUserName);

      setActivities(prev => prev.map(activity => {
        if (activity.id === activityId){
          return {
            ...activity,
            count: activity.count + 1,
            votes: [...activity.votes, currentUserName],
          };
        }
        return activity;
      }));
    } catch (err) {
      console.error('Failed to vote:', err);
    }
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
            <AvailabilityPicker dates={event.dates} startTime={9} endTime={20.5} initialAvailability={myAvailability}
                onSave={handleAvailabilitySave} />
          </div>

          <div className="activity-poll-section">
  <h3>Activity Poll</h3>
  {/* The 'activities' state will now hold the fetched data */}
  {activities.map((activity) => {
    // Check if the current user has voted for this activity
    const isVoted = activity.votes.includes(currentUserName);
    // Determine the max vote count for the bar length calculation
    const maxVotes = Math.max(1, ...activities.map(a => a.count));
    
    return (
      // Style class 'voted' for visual feedback
      <div key={activity.id} className={`activity-poll-item ${isVoted ? 'voted' : ''}`}>
        <div className="activity-poll-info">
          <span className="activity-title">{activity.title}</span>
          <div className="activity-poll-bar-container">
            {/* Calculate bar width relative to the max votes */}
            <div 
              className="activity-poll-bar" 
              style={{ width: `${(activity.count / maxVotes) * 100}%` }} 
            />
          </div>
          <small>{activity.count} votes</small>
        </div>
        
        {/* Voting Button */}
        <button 
          className={`vote-button ${isVoted ? 'voted' : ''}`}
          onClick={() => handleVote(activity.id, activity.votes)}
          disabled={isVoted} // Disable button if already voted
          aria-label={isVoted ? 'Voted' : 'Vote for this activity'}
        >
          {/* Use different icons based on vote status */}
          {isVoted ? '✅' : '👍'}
        </button>
      </div>
    );
  })}
  
  {/* Suggestion Input */}
  <input 
    type="text" 
    placeholder="Suggest an activity..." 
    className="activity-input" 
    value={newActivity}
    onChange={(e) => setNewActivity(e.target.value)}
    onKeyDown={handleActivitySuggest}
  />
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
