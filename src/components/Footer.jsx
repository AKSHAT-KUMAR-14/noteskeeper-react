import React from "react";
export default function Footer(){
  const year = new Date().getFullYear();
  return <div className="subtle footer">© {year} NotesKeeper — Local-only demo. Encryption: AES (crypto-js)</div>;
}
