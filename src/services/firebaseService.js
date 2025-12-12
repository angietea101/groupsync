import { db, auth } from './firebase';
import {
  collection,
  doc,
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

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    createdEvents: arrayUnion(eventId),
  });

  return eventId;
}
