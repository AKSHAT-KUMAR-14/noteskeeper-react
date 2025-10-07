import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Settings from "./components/Settings";
import EncryptedArea from "./components/EncryptedArea";
import SearchBar from "./components/SearchBar";

import "./index.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null); // { username, derivedKeyHex }
  const [notes, setNotes] = useState([]); // normal notes (owner field)
  const [encryptedNotesMeta, setEncryptedNotesMeta] = useState([]); // metadata for encrypted notes (ciphertext stored)
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);

  // load global settings / notes from localStorage
  useEffect(() => {
    const savedDark = JSON.parse(localStorage.getItem("nk_dark")) ?? false;
    setDark(savedDark);
    document.body.classList.toggle("dark", savedDark);
    document.body.classList.toggle("light", !savedDark);
  }, []);

  useEffect(() => {
    localStorage.setItem("nk_dark", JSON.stringify(dark));
    document.body.classList.toggle("dark", dark);
    document.body.classList.toggle("light", !dark);
  }, [dark]);

  // Load all notes (both normal & encrypted) from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nk_notes_v1")) || [];
    setNotes(saved);
    const savedEnc = JSON.parse(localStorage.getItem("nk_encnotes_v1")) || [];
    setEncryptedNotesMeta(savedEnc);
  }, []);

  useEffect(() => {
    localStorage.setItem("nk_notes_v1", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("nk_encnotes_v1", JSON.stringify(encryptedNotesMeta));
  }, [encryptedNotesMeta]);

  // ----- Authentication flow -----
  // currentUser: { username, derivedKeyHex } - derivedKeyHex kept in memory (not persisted)
  // auth components will call setCurrentUser({username, derivedKeyHex})
  if (!currentUser) {
    return (
      <div className="container">
        <div style={{maxWidth:960, margin:"0 auto"}}>
          <Header currentUser={null} />
          <div className="card" style={{marginTop:22}}>
            <div style={{display:"flex", gap:20, alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <h2>Welcome to NotesKeeper</h2>
                <p className="subtle">Create regular notes or save them in an encrypted private space.</p>
                <Login onLogin={setCurrentUser} />
              </div>
              <div style={{width:360}}>
                <Signup onSignup={setCurrentUser} />
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  // user is signed in -> show app
  const userNotes = notes.filter(n => n.owner === currentUser.username);
  const filtered = userNotes.filter(n => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (n.title + " " + n.content).toLowerCase().includes(q);
  });

  return (
    <div className="container">
      <Header currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
      <div style={{marginTop:18}} className="grid">
        <div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
            <div>
              <h2 style={{margin:0}}>Your Notes</h2>
              <div className="subtle">Regular notes (not encrypted). Use the right panel for encrypted notes.</div>
            </div>
            <div className="row">
              <SearchBar value={query} onChange={setQuery} />
              <button className="ghost" onClick={() => setDark(d => !d)}>{dark ? "Light" : "Dark"}</button>
              <Settings currentUser={currentUser} setDark={setDark} />
              <div style={{marginLeft:8}}>
                <button className="primary-btn" onClick={() => { setCurrentUser(null); }}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="card create-area" style={{marginBottom:16}}>
            <CreateArea onAdd={(note)=> setNotes(prev => [note, ...prev])} owner={currentUser.username} />
          </div>

          <div style={{marginTop:10}}>
            {filtered.length === 0 ? <div className="card">No notes yet.</div> :
              filtered.map(n => (
                <Note key={n.id}
                      note={n}
                      onDelete={(id) => setNotes(prev => prev.filter(x => x.id !== id))}
                      onEdit={(updated) => setNotes(prev => prev.map(p => p.id===updated.id ? updated : p))}
                />
              ))
            }
          </div>

          <div className="footer">
            <Footer />
          </div>
        </div>

        <div className="settings card">
          <EncryptedArea
            username={currentUser.username}
            derivedKeyHex={currentUser.derivedKeyHex}
            encryptedNotesMeta={encryptedNotesMeta}
            setEncryptedNotesMeta={setEncryptedNotesMeta}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
