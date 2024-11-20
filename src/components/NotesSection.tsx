import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquarePlus, Trash2, Edit2, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useDealStore } from '../store/dealStore';
import { Note } from '../types';

interface NotesSectionProps {
  dealId: string;
}

export default function NotesSection({ dealId }: NotesSectionProps) {
  const { notes, addNote, updateNote, deleteNote } = useDealStore();
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const dealNotes = notes.filter(note => note.dealId === dealId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: uuidv4(),
      dealId,
      content: newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addNote(note);
    setNewNote('');
  };

  const handleUpdateNote = (noteId: string) => {
    if (!editedContent.trim()) return;

    updateNote(noteId, {
      content: editedContent,
      updatedAt: new Date().toISOString()
    });

    setEditingNoteId(null);
    setEditedContent('');
  };

  const handleStartEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedContent(note.content);
  };

  const handleCancelEditing = () => {
    setEditingNoteId(null);
    setEditedContent('');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full input min-h-[100px] resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="btn btn-primary"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Add Note
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {dealNotes.map((note) => (
          <div
            key={note.id}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          >
            {editingNoteId === note.id ? (
              <div className="space-y-3">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full input min-h-[100px] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleCancelEditing()}
                    className="btn btn-secondary"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateNote(note.id)}
                    disabled={!editedContent.trim()}
                    className="btn btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white whitespace-pre-wrap">{note.content}</p>
                    <div className="mt-2 text-sm text-gray-400">
                      {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                      {note.updatedAt !== note.createdAt && (
                        <span className="ml-2">
                          (edited {format(new Date(note.updatedAt), 'MMM d, yyyy h:mm a')})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleStartEditing(note)}
                      className="p-1 hover:bg-dark-600 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:bg-dark-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {dealNotes.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No notes yet
          </div>
        )}
      </div>
    </div>
  );
}