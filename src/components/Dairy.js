import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { db } from '../firebase';
import { getAuth } from "firebase/auth"; 
import { addDoc, collection, getDocs, serverTimestamp, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';

const localizer = momentLocalizer(moment);
const auth = getAuth();
const Dairy = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [inputNote, setInputNote] = useState('');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = date => {
  setSelectedDate(date);

  // Check if a note exists for the selected date
  const formattedDate = moment(date).format('YYYY-MM-DD');
  const existingNote = notes.find(note => note.date === formattedDate);

  if (existingNote) {
    // If a note exists, set the inputNote state with the existing note's content
    setInputNote(existingNote.content);
  } else {
    // If no note exists, clear the inputNote state
    setInputNote('');
  }
};

const handleAddNote = async () => {
  const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
  const existingNote = notes.find(note => note.date === formattedDate);

  const notesRef = collection(db, 'notes');
  const noteData = {
    date: formattedDate,
    content: inputNote,
    timestamp: serverTimestamp(),
    uid: auth.currentUser.uid, // Save user UID with the note
  };

  if (existingNote) {
    // Update existing note
    await updateDoc(doc(notesRef, existingNote.id), noteData);
  } else {
    // Add a new note
    await addDoc(notesRef, noteData);
  }

  setInputNote('');
  setShowModal(false); // Close the modal after adding/updating the note
};

  useEffect(() => {
    const fetchData = async () => {
      const notesRef = collection(db, 'notes');
      const userQuery = query(notesRef, where('uid', '==', auth.currentUser.uid));
      const unsubscribe = onSnapshot(userQuery, snapshot => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);

        const updatedEvents = notesData.map(note => ({
          title: note.content,
          start: new Date(note.date),
          end: new Date(note.date),
        }));
        setEvents(updatedEvents);
      });

      return () => unsubscribe(); // Unsubscribe when component unmounts
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4 h-4/5">
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white w-1/3 h-1/3 p-4 rounded-md">
              <div className="text-center p-2">
                <p>Add a note for: {selectedDate.toDateString()}</p>
              </div>
              <textarea
                className="w-full h-2/5 p-2 ml-2 mr-4 mb-2 border border-gray-300 rounded-md mt-2"
                value={inputNote}
                onChange={e => setInputNote(e.target.value)}
                placeholder="Add note for this date..."
              />
              <div className="flex justify-between mt-2 ml-4 mr-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={handleAddNote}
                >
                  Add Note
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ borderRadius: '10px' }}
          className="w-full h-full bg-white rounded-lg shadow-lg"
          onSelectSlot={slotInfo => {
            if (slotInfo.start <= new Date()) {
              setSelectedDate(slotInfo.start);
              setShowModal(true);
            }
          }}
          selectable={date => date <= new Date()}
          onSelecting={slotInfo => handleDateChange(slotInfo.start)}
        />
      </div>
    </div>
  );
};

export default Dairy;
