const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Donor information
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Food details
  foodCategory: {
    type: String,
    required: true,
    enum: ['Cooked Meals', 'Raw Food', 'Beverages', 'Snacks', 'Desserts'],
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  storageRecommendation: {
    type: String,
    required: true,
    enum: ['Hot', 'Cold', 'Dry'],
  },
  
  // Image
  imageUrl: {
    type: String,
    required: true,
  },
  
  // AI Analysis data
  aiConfidence: {
    type: Number,
    default: null,
    min: 0,
    max: 1,
  },
  aiQualityScore: {
    type: Number,
    default: null,
    min: 0,
    max: 1,
  },
  aiFreshness: {
    type: String,
    enum: ['Fresh', 'Good', 'Fair'],
    default: null,
  },
  aiDetectedItems: {
    type: [String],
    default: [],
  },
  
  // Pickup information
  preferredPickupDate: {
    type: String,
    required: true,
    enum: ['today', 'tomorrow'],
  },
  actualPickupDate: {
    type: Date,
    default: null,
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'approved', 'assigned', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending',
  },
  
  // Assignment
  assignedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedReceiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  
  // Tracking
  trackingId: {
    type: String,
    unique: true,
    sparse: true,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate tracking ID before saving
donationSchema.pre('save', async function(next) {
  if (this.isNew && !this.trackingId) {
    // Generate tracking ID: FL-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    
    // Get count of donations today for unique ID
    const count = await mongoose.model('Donation').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      }
    });
    
    const sequence = (count + 1).toString().padStart(2, '0');
    this.trackingId = `FL-${dateStr}-${sequence}`;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
donationSchema.index({ donorId: 1, createdAt: -1 });
donationSchema.index({ status: 1 });
donationSchema.index({ trackingId: 1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
