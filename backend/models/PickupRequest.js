import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: { type: String, required: true },
    location: { type: String, default: '' },
    scheduledAt: { type: Date },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'in_transit', 'completed', 'cancelled'],
      default: 'requested',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const PickupRequest = mongoose.model('PickupRequest', pickupSchema);

export default PickupRequest;
