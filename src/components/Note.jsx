import React, { useState } from "react";

export default function Note({ note, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  function save() {
    onEdit({...note, title, content});
    setEditing(false);
  }

  return (
    <div className="note-card card">
      <div className="note-left">
        {editing ? (
          <>
            <input value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea value={content} onChange={e=>setContent(e.target.value)} />
          </>
        ) : (
          <>
            <div className="note-title">{note.title || <span className="subtle">Untitled</span>}</div>
            <div className="note-body">{note.content}</div>
            <div className="subtle" style={{marginTop:8}}>Created: {new Date(note.createdAt).toLocaleString()}</div>
          </>
        )}
      </div>

      <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8}}>
        {editing ? <>
          <button className="small-btn" onClick={()=>setEditing(false)}>Cancel</button>
          <button className="primary-btn" onClick={save}>Save</button>
        </> : <>
          <button className="small-btn" onClick={()=>setEditing(true)}>Edit</button>
          <button className="small-btn" onClick={()=>onDelete(note.id)}>Delete</button>
        </>}
      </div>
    </div>
  );
}
