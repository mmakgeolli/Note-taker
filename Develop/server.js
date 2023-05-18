const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading notes.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseErr) {
      console.log(parseErr);
      return res.status(500).json({ error: 'Error parsing notes.' });
    }

    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading notes.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseErr) {
      console.log(parseErr);
      return res.status(500).json({ error: 'Error parsing notes.' });
    }

    // Assign a unique id to the new note
    const lastNoteId = notes.length > 0 ? notes[notes.length - 1].id : 0;
    newNote.id = lastNoteId + 1;

    notes.push(newNote);

    fs.writeFile('db.json', JSON.stringify(notes), (writeErr) => {
      if (writeErr) {
        console.log(writeErr);
        return res.status(500).json({ error: 'Error writing note.' });
      }

      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
