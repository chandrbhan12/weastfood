import PickupRequest from '../models/PickupRequest.js';
import User from '../models/User.js';

// Create a new pickup request (by donor / restaurant)
export const createRequest = async (req, res) => {
  try {
    const { items, location, scheduledAt, notes } = req.body;
    const donorId = req.user?.id;

    if (!donorId) return res.status(401).json({ message: 'Unauthorized' });
    if (!items) return res.status(400).json({ message: 'Items description required' });

    const reqDoc = await PickupRequest.create({
      donor: donorId,
      items,
      location,
      scheduledAt,
      notes,
    });

    const io = req.app.get('io');
    if (io) io.emit('pickupCreated', reqDoc);

    res.status(201).json(reqDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get requests for current user (donor or pickup partner)
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const asDonor = await PickupRequest.find({ donor: userId }).populate('pickupPartner donor');
    const asPartner = await PickupRequest.find({ pickupPartner: userId }).populate('pickupPartner donor');

    res.json({ asDonor, asPartner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all requests (admin / for listing)
export const getAllRequests = async (req, res) => {
  try {
    const list = await PickupRequest.find().populate('pickupPartner donor').sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept request (by pickup partner)
export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const reqDoc = await PickupRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ message: 'Request not found' });

    reqDoc.status = 'accepted';
    reqDoc.pickupPartner = userId;
    await reqDoc.save();

    // populate for richer payload
    await reqDoc.populate('pickupPartner donor');

    const io = req.app.get('io');
    // notify donor specifically
    const donorId = reqDoc.donor?._id || reqDoc.donor;
    if (io && donorId) io.to(`user:${donorId}`).emit('pickupAccepted', reqDoc);
    // notify partner who accepted
    if (io && userId) io.to(`user:${userId}`).emit('pickupAcceptedByPartner', reqDoc);

    res.json(reqDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject request
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const reqDoc = await PickupRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ message: 'Request not found' });

    reqDoc.status = 'rejected';
    await reqDoc.save();

    await reqDoc.populate('pickupPartner donor');
    const io = req.app.get('io');
    const donorId = reqDoc.donor?._id || reqDoc.donor;
    if (io && donorId) io.to(`user:${donorId}`).emit('pickupRejected', reqDoc);

    res.json(reqDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update status (generic)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reqDoc = await PickupRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ message: 'Request not found' });

    reqDoc.status = status;
    await reqDoc.save();

    await reqDoc.populate('pickupPartner donor');
    const io = req.app.get('io');
    const donorId = reqDoc.donor?._id || reqDoc.donor;
    const partnerId = reqDoc.pickupPartner?._id || reqDoc.pickupPartner;
    if (io && donorId) io.to(`user:${donorId}`).emit('pickupStatusUpdated', reqDoc);
    if (io && partnerId) io.to(`user:${partnerId}`).emit('pickupStatusUpdated', reqDoc);

    res.json(reqDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get donation history for a donor
export const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await PickupRequest.find({ donor: userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
