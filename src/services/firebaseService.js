import { db, auth } from './firebase';
import {
  collection,
  doc,
  query,
  where,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Creates a new event in Firestore
 * @param {Object} eventData - Event details
 * @param {string} eventData.title - Event title
 * @param {string} eventData.description - Event description
 * @param {Array<string>} eventData.dates - Arary of date string
 * @returns {Promise<string>} - The created event ID
 */
export async function createEvent(eventData) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('You must be signed in to create an event');
  }

  const eventRef = doc(collection(db, 'events'));
  const eventId = eventRef.id;

  await setDoc(eventRef, {
    creatorId: user.uid,
    title: eventData.title,
    description: eventData.description || '',
    dates: eventData.dates,
    createdAt: serverTimestamp(),
  });

  const participantRef = doc(db, 'events', eventId, 'participants', user.uid);
  await setDoc(participantRef, {
    name: user.displayName || 'Anonymous',
    isCreator: true,
    userId: true,
    availability: {},
    joinedAt: serverTimestamp(),
  });

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    createdEvents: arrayUnion(eventId),
  });

  return eventId;
}

/**
 * Fetches an event by ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - Event data with id
 */
export async function getEvent(eventId) {
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    throw new Error('Event not found');
  }

  return {
    id: eventSnap.id,
    ...eventSnap.data(),
  };
}

/**
 * Fetches all particpants for an event
 * @param {string} eventId - the event id
 * @returns {Promise<Array>} - array of participant data
 */
export async function getEventParticipants(eventId) {
  const participantsRef = collection(db, 'events', eventId, 'participants');
  const participantsSnap = await getDocs(participantsRef);

  return participantsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Adds a new participant to an event
 * @param {string} eventId - da event id
 * @param {Object} participantData - participant details
 * @param {string} participantData.name - participant name
 * @returns {Promise<string>} - the participant ID
 */
export async function addParticipant(eventId, participantData) {
  const user = auth.currentUser;

  // if user is logged in, use their UID, otherwise generate a random ID
  const participantId = user?.uid || doc(collection(db, 'temp')).id;

  const participantRef = doc(db, 'events', eventId, 'participants', participantId);

  await setDoc(participantRef, {
    name: participantData.name,
    isCreator: false,
    userId: user?.uid || null,
    availability: {},
    joinedAt: serverTimestamp(),
  });

  return participantId;
}

/**
 * Adds an activity suggestion to an event
 * @param {string} eventId - The event ID
 * @param {object} activityData - activity details
 * @param {string} activityData.title - activity title
 * @param {string} activityData.suggestedBy - participant name
 * @returns {Promise<string>} - the activity ID
 */
export async function addActivity(eventId, activityData) {
  const activityRef = doc(collection(db, 'events', eventId, 'activities'));

  await setDoc(activityRef, {
    title: activityData.title,
    suggestedBy: activityData.suggestedBy,
    votes: [],
    createdAt: serverTimestamp(),
  });

  return activityRef.id;
}

/**
 * updates a participant's activity
 * @param {string} eventId - the event id
 * @param {string} participantId - the participant ID
 * @param {Object} availability - Availability map (date -> array of times)
 */
export async function updateAvailability(eventId, participantId, availability) {
  const participantRef = doc(db, 'events', eventId, 'participants', participantId);

  await updateDoc(participantRef, {
    availability: availability,
  });
}

/**
 * Votes for an activity
 * @param {string} eventId - the event id
 * @param {string} activityId - the activity ID
 * @param {string} participantName - the voter's name
 */
export async function voteForActivity(eventId, activityId, participantName) {
  const activityRef = doc(db, 'events', eventId, 'activities', activityId);

  await updateDoc(activityRef, {
    votes: arrayUnion(participantName),
  });
}

/**
 * Removes a vote from an activity
 * @param {string} eventId - the event id
 * @param {string} activityId - the activity ID
 * @param {string} participantName = the voter's name
 */
export async function removeVoteFromActivity(eventId, activityId, participantName) {
  const activityRef = doc(db, 'events', eventId, 'activities', activityId);
  const activitySnap = await getDoc(activityRef);

  if (activitySnap.exists()) {
    const currentVotes = activitySnap.data().votes || [];
    const updatedVotes = currentVotes.filter((name) => name !== participantName);

    await updateDoc(activityRef, {
      votes: updatedVotes,
    });
  }
}
/**
 * fetches all activities for an event
 * @param {string} eventId - the event id
 * @returns {Promise<Array>} - array of activity data with vote counts
 */
export async function getEventActivities(eventId) {
  const activitiesRef = collection(db, 'events', eventId, 'activities');
  const activitiesSnap = await getDocs(activitiesRef);

  return activitiesSnap.docs.map((doc) => {
    const votes = doc.data().votes || [];

    return {
      id: doc.id,
      title: doc.data().title,
      suggestedBy: doc.data().suggestedBy,
      count: votes.length,
      votes: votes,
    };
  });
}

/**
 * fetches all events created by a specific user
 * @param {string} userId - the id of the user
 * @returns {Promise<Array>} - array of event objects
 */
export async function getUserEvents(userId) {
  if (!userId) return [];

  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('creatorId', '==', userId));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
