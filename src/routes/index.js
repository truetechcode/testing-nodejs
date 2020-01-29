import { Router } from 'express';

import api from './api';
import { NotFoundError, APIError } from '../utils/errors';

const router = Router();

router.all('/', (req, res) => {
  return res.json({ message: 'Welcome to The Postr API™️. Please Request a Resource.' });
});

router.use('/api', api);

router.use((req, res) => {
  throw new NotFoundError(`${req.method.toUpperCase()} Route ${req.url} Not Found!`);
});

// Global Error Handler
router.use((err, req, res, next) => {
  const response = {
    message: err.message,
  };
  if (process.env.NODE_ENV === 'development' && !(err instanceof APIError)) {
    // Unknown server error. Response with stack trace for easier debugging
    response.stack = err.stack;
  }
  return res.status(err.status || 500).json(response);
});

export default router;
