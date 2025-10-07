import React from "react";

export default function Settings({ currentUser, setDark }) {
  return (
    <div title="Settings">
      <button className="ghost" onClick={()=> alert("Settings panel — you can add profile, font, sync, etc.")}>
        ⚙️
      </button>
    </div>
  );
}
