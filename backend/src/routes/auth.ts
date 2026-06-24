// backend/src/routes/auth.ts
import { Router } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

// Login endpoint
router.post('/login', body('username').isString(), body('password').isString(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Invalid payload' });
  }
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({ success: true, token: 'demo-token' });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Logout endpoint
router.post('/logout', (_req, res) => {
  return res.json({ success: true });
});

export default router;
