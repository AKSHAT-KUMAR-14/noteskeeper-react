import React, { useState } from "react";
import CryptoJS from "crypto-js";

function readUsers() {
  return JSON.parse(localStorage.getItem("nk_users_v1") || "[]");
}
function saveUsers(u){ localStorage.setItem("nk_users_v1", JSON.stringify(u)); }

// helper to create salt
function randomHex(len = 16) {
  const bytes = CryptoJS.lib.WordArray.random(len);
  return bytes.toString();
}

export default function Signup({ onSignup }) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  function handleSignup() {
    setErr("");
    const u = username.trim();
    if (!u || !password) { setErr("Enter username & password"); return; }
    const users = readUsers();
    if (users.some(x=>x.username === u)) { setErr("Username exists"); return; }

    const salt = randomHex(12);
    // store hashed password (sha256(salt+password)). This is *not* a server-grade storage but okay for demo.
    const passwordHash = CryptoJS.SHA256(salt + password).toString();

    users.push({username:u, salt, passwordHash});
    saveUsers(users);

    // derive AES key for encryption using PBKDF2
    const derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), { keySize: 256/32, iterations: 1000 });
    const derivedHex = derivedKey.toString();

    // call onSignup with derived key present only in memory
    onSignup({ username: u, derivedKeyHex: derivedHex });
    // clear fields
    setUsername(""); setPassword("");
  }

  return (
    <div>
      <h3>Sign up</h3>
      <div className="col">
        <input placeholder="Choose a username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Choose a password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:"flex", gap:8}}>
          <button className="primary-btn" onClick={handleSignup}>Create account</button>
        </div>
        {err && <div style={{color:"crimson"}}>{err}</div>}
        <div className="subtle" style={{marginTop:8}}>
          Passwords are stored locally (hashed). Encryption key is derived from your password and kept in memory.
        </div>
      </div>
    </div>
  );
}
