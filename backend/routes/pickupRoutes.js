import express from 'express';
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  acceptRequest,
  rejectRequest,
  updateStatus,
  getHistory,
} from '../controllers/pickupController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a pickup request (donor)
router.post('/', protect, createRequest);

// Get my requests (as donor and as partner)
router.get('/me', protect, getMyRequests);

// Get donation history for donor
router.get('/history', protect, getHistory);

// Admin / listing
router.get('/', protect, getAllRequests);

// Accept / reject
router.post('/:id/accept', protect, acceptRequest);
router.post('/:id/reject', protect, rejectRequest);

// Update status
router.post('/:id/status', protect, updateStatus);

export default router;
