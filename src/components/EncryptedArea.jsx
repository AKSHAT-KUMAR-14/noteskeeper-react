import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

/**
 * encryptedNotesMeta is an array stored globally in localStorage and passed down.
 * Each item:
 * {
 *  id, owner, titleCipher, bodyCipher, ivTitle, ivBody, createdAt
 * }
 */

export default function EncryptedArea({
  username,
  derivedKeyHex,
  encryptedNotesMeta,
  setEncryptedNotesMeta,
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [list, setList] = useState([]); // decrypted view
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");

  // decrypt notes for this user using derivedKeyHex
  useEffect(() => {
    if (!derivedKeyHex) return;

    const key = CryptoJS.enc.Hex.parse(derivedKeyHex);
    const mine = (encryptedNotesMeta || []).filter((n) => n.owner === username);

    const decrypted = mine
      .map((n) => {
        let titlePlain = "";
        let bodyPlain = "";
        try {
          const t = CryptoJS.AES.decrypt(n.titleCipher, key, {
            iv: CryptoJS.enc.Hex.parse(n.ivTitle),
          }).toString(CryptoJS.enc.Utf8);
          const b = CryptoJS.AES.decrypt(n.bodyCipher, key, {
            iv: CryptoJS.enc.Hex.parse(n.ivBody),
          }).toString(CryptoJS.enc.Utf8);
          titlePlain = t || "<empty>";
          bodyPlain = b || "<empty>";
        } catch (e) {
          titlePlain = "<decryption failed>";
          bodyPlain = "<decryption failed>";
        }
        return { ...n, titlePlain, bodyPlain };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setList(decrypted);
  }, [encryptedNotesMeta, username, derivedKeyHex]);

  // add or update encrypted note
  const encryptAndStore = () => {
    setErr("");

    if (!title.trim() && !body.trim()) {
      setErr("Enter title or body");
      return;
    }
    if (!derivedKeyHex) {
      setErr("Encryption key not set. Please log in or set your password first.");
      return;
    }

    try {
      const key = CryptoJS.enc.Hex.parse(derivedKeyHex);

      const ivTitle = CryptoJS.lib.WordArray.random(16);
      const ivBody = CryptoJS.lib.WordArray.random(16);

      const titleCipher = CryptoJS.AES.encrypt(title.trim(), key, {
        iv: ivTitle,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      const bodyCipher = CryptoJS.AES.encrypt(body.trim(), key, {
        iv: ivBody,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      const rec = {
        id: editingId || uuidv4(),
        owner: username,
        titleCipher,
        bodyCipher,
        ivTitle: ivTitle.toString(CryptoJS.enc.Hex),
        ivBody: ivBody.toString(CryptoJS.enc.Hex),
        createdAt: new Date().toISOString(),
      };

      setEncryptedNotesMeta((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? rec : p))
          : [rec, ...prev]
      );

      setTitle("");
      setBody("");
      setEditingId(null);
    } catch (error) {
      console.error("Encryption failed:", error);
      setErr("Encryption failed. Please try again.");
    }
  };

  const del = (id) => {
    if (!window.confirm("Delete this encrypted note?")) return;
    setEncryptedNotesMeta((prev) => prev.filter((x) => x.id !== id));
  };

  const startEdit = (id) => {
    setEditingId(id);
    const rec = list.find((x) => x.id === id);
    if (rec) {
      setTitle(rec.titlePlain);
      setBody(rec.bodyPlain);
    }
  };

  const exportEncrypted = () => {
    const mine = (encryptedNotesMeta || []).filter((n) => n.owner === username);
    const blob = new Blob([JSON.stringify(mine, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noteskeeper_${username}_enc_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importEncrypted = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error("Invalid file");
        const toAdd = data.filter((x) => x.owner === username);
        if (!toAdd.length) {
          alert("No notes for this user found in file");
          return;
        }
        setEncryptedNotesMeta((prev) => [...toAdd, ...prev]);
        alert(`Imported ${toAdd.length} encrypted notes`);
      } catch (err) {
        alert("Import failed: " + (err.message || err));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h3>Encrypted Space</h3>
      <div className="subtle">
        Notes here are encrypted using your password-derived key. The app never
        sends your key anywhere.
      </div>

      <div style={{ marginTop: 12 }} className="col">
        <input
          placeholder="Encrypted note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Encrypted note body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="subtle">{body.length} characters</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="primary-btn" onClick={encryptAndStore}>
              {editingId ? "Save" : "Add encrypted note"}
            </button>
            {editingId && (
              <button
                className="ghost"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setBody("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="ghost" onClick={exportEncrypted}>
          Export encrypted (ciphertext)
        </button>
        <label style={{ display: "inline-block" }} className="ghost">
          Import
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={importEncrypted}
          />
        </label>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div>
        <h4>Your encrypted notes</h4>
        {list.length === 0 ? (
          <div className="subtle">No encrypted notes yet — add one above.</div>
        ) : (
          list.map((n) => (
            <div key={n.id} className="note-card card">
              <div className="note-left">
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="note-title">
                    {n.titlePlain || <span className="subtle">Untitled (encrypted)</span>}
                  </div>
                  <div className="badge">Encrypted</div>
                </div>
                <div className="note-body">{n.bodyPlain}</div>
                <div className="subtle" style={{ marginTop: 6 }}>
                  Created: {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="small-btn" onClick={() => startEdit(n.id)}>
                  Edit
                </button>
                <button className="small-btn" onClick={() => del(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
