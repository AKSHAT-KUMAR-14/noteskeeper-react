import React from "react";

export default function Header({ currentUser, onLogout }) {
  return (
    <header className="header">
      <div className="app-title">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="#2563eb"/></svg>
        <div>
          <div style={{fontSize:18}}>NotesKeeper</div>
          <div className="subtle">fast • simple • encrypted</div>
        </div>
      </div>
      <div className="controls">
        {currentUser ? <div className="subtle">Signed in as <strong>{currentUser.username}</strong></div> : null}
      </div>
    </header>
  );
}
