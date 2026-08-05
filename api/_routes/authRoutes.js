import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../_models/User.js';
import { protect, admin } from '../_middleware/auth.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token (Admin Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update admin password
// @route   PUT /api/auth/update-password
// @access  Private/Admin
router.put('/update-password', protect, admin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create first admin (Uncomment to create initially, then comment out!)
// @route   POST /api/auth/setup
/*
router.post('/setup', async (req, res) => {
  try {
    const userExists = await User.findOne({ username: 'admin' });
    if (userExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const user = await User.create({
      username: 'admin',
      password: 'password123', // Change this!
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/

// @desc    Update admin username
// @route   PUT /api/auth/update-username
// @access  Private/Admin
router.put('/update-username', protect, admin, async (req, res) => {
  const { currentPassword, newUsername } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      // Check if username is already taken
      const existing = await User.findOne({ username: newUsername });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = newUsername;
      await user.save();
      res.json({ message: 'Username updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update gatekeeper passcode
// @route   PUT /api/auth/update-gatekeeper
// @access  Private/Admin
router.put('/update-gatekeeper', protect, admin, async (req, res) => {
  const { currentPassword, newPasscode } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.gatekeeperPasscode = newPasscode;
      await user.save();
      res.json({ message: 'Gatekeeper passcode updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Verify gatekeeper passcode
// @route   POST /api/auth/verify-gatekeeper
// @access  Public
router.post('/verify-gatekeeper', async (req, res) => {
  const { passcode } = req.body;

  try {
    const user = await User.findOne({ role: 'admin' });
    if (!user) {
      return res.status(404).json({ message: 'No admin found' });
    }
    
    const storedPasscode = user.gatekeeperPasscode || 'admin2026';
    
    if (passcode === storedPasscode) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid passcode' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
