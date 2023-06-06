import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotesStyles.css";
import { urlDelete, urlGetAll, urlGet,urlUpdate } from "../../endpoints";
import NoteWindow from "../NoteWindow/NoteWindow";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import ConfirmModal from "../ConfirmModal";
import EditModal from "../NoteWindow/NoteWindow";


export interface Note {
  id: string;
  title: string;
  status: number;
  details: string;
  creationDate: string;
  editDate: string|null;
}

interface NotesResponse {
  notes: Note[];
}

export const NotesBoard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteWindowVisible, setNoteWindowVisible] = useState(false);
  const [deleteWindowVisible, setDeleteWindowVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [deleteCount, setDeleteCount] = useState(0);



  useEffect(() => {
    getAllNotes();
  }, [deleteCount, notes]);

  const getAllNotes = () => {
    axios
      .get<NotesResponse>(urlGetAll)
      .then((response) => {
        setNotes(response.data.notes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const filterNotesByStatus = (status: number): Note[] => {
    return notes.filter((note) => note.status === status);
  };

  const renderNotes = (notes: Note[]): React.ReactNode => {
    return notes.map((note) => (
      <div
        key={note.id}
        className={`noteOverview ${selectedNote?.id === note.id ? "dragging" : ""}`}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, note.id)}
        onClick={() => handleNoteClick(note)}
      >
        <h5>{note.title}</h5>
  
        <Tooltip title="Delete" trigger="hover">
          <button
            className="NoteButton"
            key={note.id}
            onClick={(e) => {
              e.stopPropagation(); // Stop event propagation to prevent triggering handleNoteClick
              onClickDeleteNote(note.id);
            }}
          >
            <DeleteOutlined alt="Delete"/>
          </button>
        </Tooltip>
      </div>
    ));
  };
  
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, noteId: string) => {
    event.dataTransfer.setData("text/plain", noteId);
    event.currentTarget.classList.add("dragging"); // Add a CSS class to the dragged div
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: number) => {
    event.preventDefault();
    const noteId = event.dataTransfer.getData("text/plain");
    const updatedNote = notes.find((note) => note.id === noteId);
    if (updatedNote) {
      axios
        .get<Note>(`${urlGet}/${noteId}`)
        .then((response) => {
          const noteData = response.data;
          noteData.status = status;
          return axios.put(`${urlUpdate}`, noteData);
        })
        .then(() => {
          // Update the local notes state
          const updatedNotes = [...notes];
          const noteIndex = updatedNotes.findIndex((note) => note.id === noteId);
          if (noteIndex !== -1) {
            updatedNotes[noteIndex].status = status;
            setNotes(updatedNotes);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  
  

  const handleNoteClick = (note: Note) => {
    axios
      .get<Note>(`${urlGet}/${note.id}`)
      .then((response) => {
        setSelectedNote(response.data);
        setNoteWindowVisible(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseNoteWindow = () => {
    setNoteWindowVisible(false);
    setSelectedNote(undefined);
  };

 const onClickDeleteNote=(id: string)=>{
    setDeleteWindowVisible(true);
    setSelectedNoteId(id);
 }
  const handleDelete = () => {
    axios
      .delete<string>(`${urlDelete}/${selectedNoteId}`)
      .then(() => {
        setDeleteCount((prevCount) => prevCount + 1); // Increment deleteCount
        setDeleteWindowVisible(false);
        setSelectedNoteId(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleNoteUpdate = (updatedNote: Note) => {
    axios
      .put(`${urlUpdate}`, updatedNote)
      .then(() => {
        setNoteWindowVisible(false);
        setSelectedNote(undefined);
        getAllNotes();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const closeDeleteNoteWindow = () => {
    setDeleteWindowVisible(false);
    setSelectedNoteId(null);
  };


  const todoNotes = filterNotesByStatus(0);
  const inProgressNotes = filterNotesByStatus(1);
  const doneNotes = filterNotesByStatus(2);

  return (
     <div className="NotesBoard">
      <div className="StatusesContainer">
        <div className="StatusContainer"
            onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 0)}>
          <span className="status">TO DO</span>
          {renderNotes(todoNotes)}
        </div>
        <div className="StatusContainer"
            onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 1)}>
          <span className="status">IN PROGRESS</span>
          {renderNotes(inProgressNotes)}
        </div>
        <div className="StatusContainer"
            onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 2)}>
          <span className="status">DONE</span>
          {renderNotes(doneNotes)}
        </div>
      </div>

      <EditModal
        visible={noteWindowVisible}
        onCancel={handleCloseNoteWindow}
        onSave={handleNoteUpdate}
        initialValues={selectedNote}
      />

      <ConfirmModal
        question="Are you sure you want to delete this note?"
        buttonTitle="Delete"
        handleOk={handleDelete}
        handleCancel={closeDeleteNoteWindow}
        isOpen={deleteWindowVisible}
      />
    </div>
  );
};

export default NotesBoard;
