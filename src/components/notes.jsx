import "./notes.css";
import { useState, useCallback, memo } from "react";
import { DeleteIcon, PendingIcon, CloseIcon } from "./icons";

export const Notes = memo(function Notes({ onClose, onSubmit }) {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesList, setNotesList] = useState([""]);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleAddNote = useCallback(() => {
    setNotesList((prev) => [...prev, ""]);
  }, []);

  const handleNoteChange = useCallback(
    (index, value) => {
      setNotesList((prev) => {
        const updatedNotes = [...prev];
        updatedNotes[index] = value;
        return updatedNotes;
      });
    },
    []
  );

  const handleSubmit = useCallback(() => {
    onSubmit({
      title: notesTitle,
      subNotes: notesList.map((note) => ({
        id: Date.now() + Math.random(),
        text: note,
        completed: false,
      })),
    });
    handleClose();
  }, [notesTitle, notesList, onSubmit, handleClose]);

  const handleRemoveNote = useCallback(
    (index) => {
      setNotesList((prev) => prev.filter((_, i) => i !== index));
    },
    []
  );

  return (
    <div className={`notes-popup-overlay ${isClosing ? "closing" : ""}`}>
      <div className="notes-popup-container">
        <div className={`notes-container ${isClosing ? "closing" : ""}`}>
          <div className="notes-header">
            <h1>Add Your Notes</h1>
            <button className="close-btn" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>
          <div className="notes-title-input">
            <input
              type="text"
              placeholder="Enter Notes Title"
              className="title-input"
              value={notesTitle}
              onChange={(e) => setNotesTitle(e.target.value)}
            />
          </div>
          <div className="notes-input">
            <h1>Add Notes Itinerary</h1>
            {notesList.map((note, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <div className="task-status-btn pending">
                  <PendingIcon />
                </div>
                <input
                  type="text"
                  placeholder="Enter itinerary notes"
                  className="title-input"
                  value={note}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                />
                <button
                  onClick={() => handleRemoveNote(index)}
                  style={{
                    background: "rgba(255, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 0, 0, 0.2)",
                    color: "#ff4444",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "35px",
                    height: "35px",
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
            <div className="notes-btn">
              <button className="add-notes-btn" onClick={handleAddNote}>
                + Add Notes
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
