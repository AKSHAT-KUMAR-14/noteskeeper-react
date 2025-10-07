import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CreateArea({ onAdd, owner }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function submit() {
    if (!title.trim() && !content.trim()) return;
    const note = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      owner,
      createdAt: new Date().toISOString()
    };
    onAdd(note);
    setTitle(""); setContent("");
  }

  return (
    <div className="col">
      <input placeholder="Title (optional)" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Write your note..." value={content} onChange={e=>setContent(e.target.value)} />
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div className="subtle">{content.length} characters</div>
        <div className="row">
          <button className="ghost" onClick={() => { setTitle(""); setContent(""); }}>Clear</button>
          <button className="primary-btn" onClick={submit}>Add</button>
        </div>
      </div>
    </div>
  );
}
