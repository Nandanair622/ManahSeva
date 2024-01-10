import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import Sentiment from "sentiment";
import Chart from "chart.js/auto";

const localizer = momentLocalizer(moment);

const Dairy = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [inputNote, setInputNote] = useState("");
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [monthOverallSentiment, setMonthOverallSentiment] = useState({
    score: 0,
    category: "Neutral",
  });
  const [sentimentData, setSentimentData] = useState([]);
  const auth = getAuth();

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Check if a note exists for the selected date
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const existingNote = notes.find((note) => note.date === formattedDate);

    if (existingNote) {
      // If a note exists, set the inputNote state with the existing note's content
      setInputNote(existingNote.content);
    } else {
      // If no note exists, clear the inputNote state
      setInputNote("");
    }
  };

  const handleAddNote = async () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const existingNote = notes.find((note) => note.date === formattedDate);

    // Sentiment Analysis
    const sentiment = new Sentiment();
    const sentimentResult = sentiment.analyze(inputNote);

    const notesRef = collection(db, "notes");
    const noteData = {
      date: formattedDate,
      content: inputNote,
      sentiment: {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        tokens: sentimentResult.tokens,
        words: sentimentResult.words,
        positive: sentimentResult.positive,
        negative: sentimentResult.negative,
      },
      timestamp: serverTimestamp(),
      uid: auth.currentUser.uid,
    };

    if (existingNote) {
      // Update existing note
      await updateDoc(doc(notesRef, existingNote.id), noteData);
    } else {
      // Add a new note
      await addDoc(notesRef, noteData);
    }

    setInputNote("");
    setShowModal(false);
    setSelectedNote(null);
  };

  const handleEditNote = async () => {
    if (selectedNote) {
      const notesRef = collection(db, "notes");
      // Sentiment Analysis
      const sentiment = new Sentiment();
      const sentimentResult = sentiment.analyze(inputNote);

      await updateDoc(doc(notesRef, selectedNote.id), {
        content: inputNote,
        sentiment: {
          score: sentimentResult.score,
          comparative: sentimentResult.comparative,
          tokens: sentimentResult.tokens,
          words: sentimentResult.words,
          positive: sentimentResult.positive,
          negative: sentimentResult.negative,
        },
        timestamp: serverTimestamp(),
      });
      setInputNote("");
      setShowModal(false);
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = async () => {
    if (selectedNote) {
      const notesRef = collection(db, "notes");
      await deleteDoc(doc(notesRef, selectedNote.id));
      setShowModal(false);
      setSelectedNote(null);
    }
  };

  const calculateMonthOverallSentiment = () => {
    const selectedMonth = moment(selectedDate).month();
    const selectedYear = moment(selectedDate).year();
    const filteredNotes = notes.filter((note) => {
      const noteMonth = moment(note.date).month();
      const noteYear = moment(note.date).year();
      return noteMonth === selectedMonth && noteYear === selectedYear;
    });

    const totalNotes = filteredNotes.length;
    let totalSentimentScore = 0;

    filteredNotes.forEach((note) => {
      if (note.sentiment && typeof note.sentiment.score !== "undefined") {
        totalSentimentScore += note.sentiment.score;
      }
    });

    const averageScore =
      totalNotes === 0 ? 0 : totalSentimentScore / totalNotes;
    const clampedScore = Math.max(-1, Math.min(1, averageScore));

    let sentimentCategory;
    if (clampedScore > 0.2) {
      sentimentCategory = "Positive";
    } else if (clampedScore < -0.2) {
      sentimentCategory = "Negative";
    } else {
      sentimentCategory = "Neutral";
    }

    setMonthOverallSentiment({
      score: clampedScore,
      category: sentimentCategory,
    });
  };

  const handleMonthChange = (date) => {
    setSelectedDate(date);
  };

  // Function to update sentiment and graph data based on selected month
  const updateSentimentAndGraph = () => {
    calculateMonthOverallSentiment();
    prepareSentimentData();
  };

  useEffect(() => {
    updateSentimentAndGraph();
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      const notesRef = collection(db, "notes");
      const userQuery = query(
        notesRef,
        where("uid", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(userQuery, (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);

        const updatedEvents = notesData.map((note) => ({
          title: note.content,
          start: new Date(note.date),
          end: new Date(note.date),
        }));
        setEvents(updatedEvents);

        // Update sentiment and graph data after setting notes
        updateSentimentAndGraph();
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  // Function to prepare sentiment data for the line chart
  const prepareSentimentData = () => {
    const selectedMonth = moment(selectedDate).month(); // Get selected month (0-11)
    const selectedYear = moment(selectedDate).year(); // Get selected year
    const daysInMonth = moment(selectedDate).daysInMonth(); // Get the number of days in the selected month
    const startDate = moment(selectedDate).startOf("month");

    const newData = [];
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = startDate.clone().add(i, "days");
      const formattedDate = currentDate.format("YYYY-MM-DD");

      const existingNote = notes.find(
        (note) =>
          moment(note.date).month() === selectedMonth &&
          moment(note.date).year() === selectedYear &&
          note.date === formattedDate
      );

      const sentimentScore =
        existingNote &&
        existingNote.sentiment &&
        typeof existingNote.sentiment.score !== "undefined"
          ? existingNote.sentiment.score
          : 0;

      newData.push({
        date: formattedDate,
        score: sentimentScore,
      });
    }
    setSentimentData(newData);
  };

  // Call prepareSentimentData when notes or selectedDate change
  useEffect(() => {
    prepareSentimentData();
  }, [notes, selectedDate]);

  // Render the line chart using Chart.js
  useEffect(() => {
    const ctx = document.getElementById("sentimentChart");
    let chartInstance = null;

    if (ctx && sentimentData.length > 0) {
      // Destroy existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: sentimentData.map((data) => data.date),
          datasets: [
            {
              label: "Sentiment Score",
              data: sentimentData.map((data) => data.score),
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          // Add chart options if needed
        },
      });
    }

    // Return a cleanup function to destroy the chart when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [sentimentData]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4 h-4/5">
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white w-1/3 h-1/3 p-4 rounded-md">
              {selectedNote ? (
                <>
                  <div className="text-center p-2">
                    <p>Edit note for: {selectedNote.date}</p>
                  </div>
                  <textarea
                    className="w-full h-2/5 p-2 ml-2 mr-4 mb-2 border border-gray-300 rounded-md mt-2"
                    value={inputNote}
                    onChange={(e) => setInputNote(e.target.value)}
                    placeholder="Edit note for this date..."
                  />
                  <div className="flex justify-between mt-2 ml-4 mr-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                      onClick={handleEditNote}
                    >
                      Save Changes
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                      onClick={handleDeleteNote}
                    >
                      Delete Note
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center p-2">
                    <p>Add a note for: {selectedDate.toDateString()}</p>
                  </div>
                  <textarea
                    className="w-full h-2/5 p-2 ml-2 mr-4 mb-2 border border-gray-300 rounded-md mt-2"
                    value={inputNote}
                    onChange={(e) => setInputNote(e.target.value)}
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
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ borderRadius: "10px" }}
          className="w-full h-full bg-white rounded-lg shadow-lg"
          onSelectEvent={(event) => {
            const clickedNote = notes.find(
              (note) => note.date === moment(event.start).format("YYYY-MM-DD")
            );
            setSelectedNote(clickedNote);
            setInputNote(clickedNote ? clickedNote.content : "");
            setShowModal(true);
          }}
          onSelectSlot={(slotInfo) => {
            if (slotInfo.start <= new Date()) {
              handleMonthChange(slotInfo.start); // Update selectedDate on month change
              setShowModal(true);
              setSelectedNote(null);
            }
          }}
          selectable={(date) => date <= new Date()}
          onSelecting={(slotInfo) => handleDateChange(slotInfo.start)}
          onNavigate={(date) => handleMonthChange(date)} // Handle month change in the calendar
        />
        <h2>Overall Sentiment: {monthOverallSentiment.category}</h2>
        <p>Average Score: {monthOverallSentiment.score}</p>

        <canvas id="sentimentChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default Dairy;
