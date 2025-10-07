import React, { useState } from "react";
import CryptoJS from "crypto-js";

function readUsers() {
  return JSON.parse(localStorage.getItem("nk_users_v1") || "[]");
}

export default function Login({ onLogin }) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  function handleLogin() {
    setErr("");
    const users = readUsers();
    const u = users.find(x => x.username === username.trim());
    if (!u) { setErr("No such user"); return; }
    const passwordHash = CryptoJS.SHA256(u.salt + password).toString();
    if (passwordHash !== u.passwordHash) { setErr("Incorrect password"); return; }
    // derive AES key for encryption
    const derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(u.salt), { keySize: 256/32, iterations: 1000 });
    const derivedHex = derivedKey.toString();
    onLogin({ username: u.username, derivedKeyHex: derivedHex });
    setUsername(""); setPassword("");
  }

  return (
    <div style={{marginTop:8}}>
      <h3>Sign in</h3>
      <div className="col">
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:"flex", gap:8}}>
          <button className="primary-btn" onClick={handleLogin}>Sign in</button>
        </div>
        {err && <div style={{color:"crimson"}}>{err}</div>}
      </div>
    </div>
  );
}
