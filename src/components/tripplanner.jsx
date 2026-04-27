import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "../assets/calender.png";
import { Notes } from "./notes";
import { DeleteIcon, CheckIcon, PendingIcon } from "./icons";
import "./tripplanner.css";

export function TripPlanner() {
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState("");
  const [editingNoteDate, setEditingNoteDate] = useState("");
  const [editingSubNotes, setEditingSubNotes] = useState([]);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showNotesPopup, setShowNotesPopup] = useState(false);

  useEffect(() => {
    try {
      const storedTrip = localStorage.getItem("tripDetails");
      const storedNotes = localStorage.getItem("tripNotes");

      if (storedTrip) {
        const parsedTrip = JSON.parse(storedTrip);
        setTripDetails(parsedTrip);
      } else {
        navigate("/enter-your-plans");
        return;
      }

      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (
          Array.isArray(parsedNotes) &&
          parsedNotes.every(
            (note) =>
              note &&
              typeof note === "object" &&
              "id" in note &&
              "title" in note &&
              "subNotes" in note &&
              Array.isArray(note.subNotes)
          )
        ) {
          setNotes(parsedNotes);
        } else {
          console.warn("Invalid notes structure found in localStorage");
          localStorage.removeItem("tripNotes");
          setNotes([]);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setNotes([]);
    }
  }, [navigate]);

  const calculateCountdown = useCallback(() => {
    if (!tripDetails) return;

    const now = new Date().getTime();
    const tripDate = new Date(
      `${tripDetails.departureDate} ${tripDetails.departureTime}`
    ).getTime();
    const difference = tripDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }
  }, [tripDetails]);

  useEffect(() => {
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [calculateCountdown]);

  useEffect(() => {
    try {
      if (notes && notes.length > 0) {
        localStorage.setItem("tripNotes", JSON.stringify(notes));
      } else {
        localStorage.removeItem("tripNotes");
      }
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  }, [notes]);

  const handleDeleteTrip = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to delete this trip? This action cannot be undone."
      )
    ) {
      try {
        localStorage.removeItem("tripDetails");
        localStorage.removeItem("tripNotes");
        setTripDetails(null);
        setNotes([]);
        navigate("/");
      } catch (error) {
        console.error("Error deleting trip data:", error);
      }
    }
  }, [navigate]);

  const handleAddNote = useCallback(() => {
    setShowNotesPopup(true);
  }, []);

  const handleNotesSubmit = useCallback((noteData) => {
    const newNote = {
      id: Date.now(),
      title: noteData.title || "Untitled",
      subNotes: noteData.subNotes.map((note) => ({
        ...note,
        completed: false,
      })),
    };
    setNotes((prev) => [...prev, newNote]);
    setShowNotesPopup(false);
  }, []);

  const handleToggleTaskStatus = useCallback((noteId, subNoteId) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            subNotes: note.subNotes.map((subNote) => {
              if (subNote.id === subNoteId) {
                return {
                  ...subNote,
                  completed: !subNote.completed,
                };
              }
              return subNote;
            }),
          };
        }
        return note;
      })
    );
  }, []);

  const handleDeleteNote = useCallback((noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  }, []);

  const handleDeleteSubNote = useCallback((noteId, subNoteId) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            subNotes: note.subNotes.filter(
              (subNote) => subNote.id !== subNoteId
            ),
          };
        }
        return note;
      })
    );
  }, []);
  const handleEditNote = useCallback((noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingNoteTitle(note.title);
      setEditingSubNotes([...note.subNotes]);
      // Use the note's custom date if it exists, otherwise use the original calculated date
      if (note.customDate) {
        setEditingNoteDate(note.customDate);
      } else {
        const index = notes.findIndex((n) => n.id === noteId);
        const date = new Date(tripDetails.departureDate);
        date.setDate(date.getDate() + index);
        setEditingNoteDate(date.toISOString().split('T')[0]);
      }
    }
  }, [notes, tripDetails]);

  const handleSaveNote = useCallback((noteId) => {
    setNotes((prev) => {
      const index = prev.findIndex(note => note.id === noteId);
      if (index === -1) return prev;

      const editingDate = new Date(editingNoteDate);
      const tripStartDate = new Date(tripDetails.departureDate);
      const daysDiff = Math.floor((editingDate - tripStartDate) / (1000 * 60 * 60 * 24));

      const editedNote = {
        ...prev[index],
        title: editingNoteTitle,
        subNotes: editingSubNotes.map((subNote) => ({
          ...subNote,
          completed: subNote.completed || false,
        })),
        customDate: editingNoteDate,
      };

      const newNotes = prev.filter(note => note.id !== noteId);
      const targetIndex = newNotes.findIndex(note => {
        const noteDate = new Date(note.customDate || tripDetails.departureDate);
        return noteDate > editingDate;
      });

      if (targetIndex === -1) {
        newNotes.push(editedNote);
      } else {
        newNotes.splice(targetIndex, 0, editedNote);
      }

      return newNotes;
    });
    
    setEditingNoteId(null);
    setEditingNoteTitle("");
    setEditingNoteDate("");
    setEditingSubNotes([]);
  }, [editingNoteTitle, editingSubNotes, editingNoteDate, tripDetails]);

  const handleCancelEdit = useCallback(() => {
    setEditingNoteId(null);
    setEditingNoteTitle("");
    setEditingNoteDate("");
    setEditingSubNotes([]);
  }, []);

  const handleEditSubNote = useCallback((subNoteId, newText) => {
    setEditingSubNotes((prev) =>
      prev.map((subNote) => {
        if (subNote.id === subNoteId) {
          return { ...subNote, text: newText };
        }
        return subNote;
      })
    );
  }, []);

  const handleAddSubNote = useCallback(() => {
    if (editingNoteId) {
      setEditingSubNotes((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          text: "",
          completed: false,
        },
      ]);
    }
  }, [editingNoteId]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const renderNoteContent = (note, index) => {
    return editingNoteId === note.id ? (
      <div className="editing-note">
        <input
          type="text"
          className="edit-title-input"
          value={editingNoteTitle}
          onChange={(e) => setEditingNoteTitle(e.target.value)}
          placeholder="Enter note title"
        />
        <input
          type="date"
          className="edit-date-input"
          value={editingNoteDate}
          onChange={(e) => setEditingNoteDate(e.target.value)}
          min={tripDetails.departureDate}
        />
        <div className="note-items">
          {editingSubNotes.map((subNote, subIndex) => (
            <div
              key={subNote.id}
              className={`note-item ${subNote.completed ? "completed" : ""}`}
            >
              <span className="note-number">{subIndex + 1}.</span>
              <input
                type="text"
                className="edit-subnote-input"
                value={subNote.text}
                onChange={(e) => handleEditSubNote(subNote.id, e.target.value)}
                placeholder="Enter note text"
              />
              <button
                className="delete-subnote-btn"
                onClick={() => {
                  setEditingSubNotes((prev) =>
                    prev.filter((n) => n.id !== subNote.id)
                  );
                }}
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="note-actions">
          <button className="add-subnote-btn" onClick={handleAddSubNote}>
            + Add Note
          </button>
          <div className="edit-actions">
            <button
              className="save-btn"
              onClick={() => handleSaveNote(note.id)}
            >
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="note-header">
          <h4 className="note-card-title">{note.title}</h4>
          <button
            className="edit-note-btn"
            onClick={() => handleEditNote(note.id)}
          >
            ✎
          </button>
        </div>        <p className="note-date">
          {(() => {
            if (!tripDetails?.departureDate) return "";
            const date = new Date(note.customDate || tripDetails.departureDate);
            return (
              formatDate(date) +
              ", " +
              date.toLocaleDateString("en-US", { weekday: "long" })
            );
          })()}
        </p>
        <div className="note-items">
          {note.subNotes.map((subNote, subIndex) => (
            <div
              key={subNote.id}
              className={`note-item ${subNote.completed ? "completed" : ""}`}
            >
              <div
                className={`task-status-btn ${
                  subNote.completed ? "completed" : "pending"
                }`}
                onClick={() => handleToggleTaskStatus(note.id, subNote.id)}
              >
                {subNote.completed ? <CheckIcon /> : <PendingIcon />}
              </div>
              <span className="note-number">{subIndex + 1}.</span>
              <p className="note-text">{subNote.text}</p>
              <button
                className="delete-subnote-btn"
                onClick={() => handleDeleteSubNote(note.id, subNote.id)}
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="planner-container">
        <div className="timer-container">
          <div className="trip-container">
            <div className="location-container">
              <p className="city">Next Trip</p>
              <p className="location">
                {tripDetails?.location?.name?.split(",")[0] || "Loading..."}
              </p>
            </div>
            <span className="arrow">&rarr;</span>
            <div className="departure-container">
              <p className="departure">Departure</p>
              <p className="date">{formatDate(tripDetails?.departureDate)}</p>
            </div>
          </div>
          <div className="trip-calender">
            <div className="days">
              <p>{countdown.days}</p>
              <p className="aqua">DAYS</p>
            </div>
            <div className="hours">
              <p>{countdown.hours}</p>
              <p className="aqua">HOURS</p>
            </div>
            <div className="minutes">
              <p>{countdown.minutes}</p>
              <p className="aqua">MINUTES</p>
            </div>
            <div className="seconds">
              <p>{countdown.seconds}</p>
              <p className="aqua">SECONDS</p>
            </div>
          </div>
        </div>
        <div className="planner-actions">
          <button className="delete-trip-btn" onClick={handleDeleteTrip}>
            <DeleteIcon />
            Delete Trip
          </button>
          <button className="add-day-btn" onClick={handleAddNote}>
            <img src={Calender} width={20} alt="calender" />
            Add Day
          </button>
        </div>
        <div className="trip-planner">
          <div className="notes-grid">
            {notes.map((note, index) => (
              <div className="note-card" key={note.id}>
                <div className="note-card-header">                  <div className="note-day">
                    <h3>Day {(() => {
                      const noteDate = new Date(note.customDate || tripDetails.departureDate);
                      const startDate = new Date(tripDetails.departureDate);
                      const diffTime = noteDate - startDate;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays + 1;
                    })()}</h3>
                  </div>
                  <button
                    className="delete-note-btn"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
                <div className="note-card-content">
                  {renderNoteContent(note, index)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showNotesPopup && (
        <Notes
          onClose={() => setShowNotesPopup(false)}
          onSubmit={handleNotesSubmit}
        />
      )}
    </>
  );
}
