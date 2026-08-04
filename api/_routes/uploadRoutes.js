import express from 'express';
import { upload } from '../_config/cloudinary.js';
import { protect, admin } from '../_middleware/auth.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (req.file && req.file.path) {
    res.json({ url: req.file.path });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
});

export default router;
