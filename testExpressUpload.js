import express from 'express';
import { upload } from './api/config/cloudinary.js';

const app = express();
app.post('/test-upload', upload.single('image'), (req, res) => {
  res.json({ file: req.file });
});
app.use((err, req, res, next) => {
  console.log("Express caught error:", err.message);
  res.status(500).json({ error: err.message });
});

// Start a tiny test server on port 5001
const server = app.listen(5001, async () => {
  try {
    const fd = new FormData();
    const blob = new Blob(['fake image content'], { type: 'image/png' });
    fd.append('image', blob, 'test.png');

    const res = await fetch('http://localhost:5001/test-upload', {
      method: 'POST',
      body: fd
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
