import React from 'react';

export default function NoteModal({ modal, setModal, saveNote, deleteNote }) {
  if (!modal) return null;

  return (
    <div 
      className="note-modal-backdrop" 
      onClick={e => { if(e.target.classList.contains('note-modal-backdrop')) setModal(null); }}
    >
      <div className="note-modal">
        <div className="modal-top-strip"></div>
        <div className="modal-body">
          <input
            className="modal-title-input"
            placeholder="Note title..."
            value={modal.title}
            onChange={e => setModal(m => ({...m, title: e.target.value}))}
            autoFocus
          />
          <br/>
          <input
            type="date"
            className="modal-date-input"
            value={modal.date}
            onChange={e => setModal(m => ({...m, date: e.target.value, id: modal.isNew ? e.target.value : m.id}))}
          />
          <br/>
          <textarea
            className="modal-textarea"
            placeholder="Write your note here..."
            value={modal.content}
            onChange={e => setModal(m => ({...m, content: e.target.value}))}
          />
          <div className="modal-actions">
            {!modal.isNew && (
              <button className="btn-delete" onClick={() => deleteNote(modal.id)}>Delete</button>
            )}
            <button className="btn-cancel" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn-save" onClick={saveNote}>Save Note</button>
          </div>
        </div>
      </div>
    </div>
  );
}