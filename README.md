# NotesKeeper React

**NotesKeeper React** is a secure, modern, and easy-to-use note-taking application built with **React**. This app allows users to store both regular and fully **encrypted notes**, ensuring sensitive information remains private. Encryption is handled client-side using password-derived keys, so your data never leaves your device unencrypted.

---

## Features

### General Notes
- Create, edit, and delete regular notes.
- Responsive and clean UI with minimal distractions.
- Notes are stored locally in `localStorage`.

### Encrypted Notes
- AES-256 encryption for all sensitive notes.
- Notes are encrypted using a **password-derived key**.
- Each note has a randomly generated **Initialization Vector (IV)** for enhanced security.
- Users can export and import encrypted notes as JSON files (ciphertext only).
- Fully decrypted only in the browser session using your password.

### Additional Features
- Notes are displayed with timestamps.
- Clear separation between regular and encrypted notes.
- Simple, card-based layout for easy navigation.
- Works entirely offline with local storage.

---

## Technology Stack
- **Frontend:** React.js (Functional Components + Hooks)
- **Encryption:** CryptoJS (AES-CBC with PKCS7 padding)
- **State Management:** React useState and useEffect
- **Unique IDs:** UUID v4
- **Storage:** Browser `localStorage`
- **Styling:** CSS / TailwindCSS compatible

---

## Installation & Running Locally

1. Clone the repository:

```bash
git clone https://github.com/AKSHAT-KUMAR-14/noteskeeper-react
cd noteskeeper-react
```

2. Install Dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm start
```

4. Open in Browser:

```bash
http://localhost:3000
```

## Usage
1. Regular Notes:
- Enter a title and body → click Add Note.

2. Encrypted Notes:

- Set a password (on login or initialization).

- Enter a title and body → click Add Encrypted Note.

- Export your encrypted notes for backup if needed.

- Import previously exported encrypted notes to restore.

⚠️ The password-derived key is never sent anywhere. Losing the password means you cannot decrypt your notes.

## Security Considerations

- AES-CBC with random IV ensures strong encryption.
- All encryption/decryption happens client-side.
- No sensitive data is transmitted over the network.
- Each note's IV is stored alongside ciphertext to allow decryption.

## Contribution

Feel free to fork the repository, improve features, or submit bug fixes via pull requests.

## License

This project is licensed under the MIT License.

## Author

Akshat – Developed as a secure note-keeping React application with encrypted storage support.