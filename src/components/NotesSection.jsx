import React from 'react';
import { formatDisplayDate } from '../utils/helpers';

export default function NotesSection({ 
  openNewNote, noteFilter, setNoteFilter, displayNotes, todayStr, openNote 
}) {
  return (
    <section className="notes-section">
      <div className="section-header">
        <h2 className="section-title">Notes</h2>
        <button className="icon-btn-add" onClick={openNewNote}>+ New</button>
      </div>

      <div className="notes-filters">
        {['selected', 'month', 'year', 'all'].map(filter => (
          <button 
            key={filter} 
            className={`filter-btn ${noteFilter === filter ? 'active' : ''}`}
            onClick={() => setNoteFilter(filter)}
          >
            {filter === 'selected' ? 'Selection' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="notes-list">
        {displayNotes.length === 0 ? (
          <div className="empty-state">
            No notes found.<br/>
            <span>Click + New to add one.</span>
          </div>
        ) : (
          displayNotes.map(note => {
            const isToday = note.key === todayStr;
            return (
              <div key={note.key} className={`note-card ${isToday ? 'current-day-note' : ''}`} onClick={() => openNote(note.key)}>
                {/* little flag so today's notes don't get lost in the mix */}
                {isToday && <div className="today-badge">Today</div>}
                <div className="note-card-title">{note.title || 'Untitled'}</div>
                <div className="note-card-date">{formatDisplayDate(note.key)}</div>
                {note.content && <div className="note-card-preview">{note.content}</div>}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}