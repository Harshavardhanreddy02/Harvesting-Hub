import mongoose from 'mongoose';

// Create a more flexible schema that accommodates both old and new product structures
const productSchema = new mongoose.Schema({
  // Basic fields that every product should have
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  
  // Fields from the old schema
  stockQuantity: { type: Number, default: 50 },
  status: { type: String, enum: ['Sold Out', 'On Sale'], default: 'On Sale' },
  discount: { type: Number, default: 0 },
  seller: { type: String, default: null },
  email: { type: String }, // No longer required to accommodate old data
  
  // Fields from the new schema
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  stock: {
    type: Number,
    required: false, // Made optional
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: false
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalSales: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ratings: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      averageRating: 0,
      totalRatings: 0,
      ratingDetails: []
    }
  }
}, { 
  timestamps: true,
  // This is crucial - it tells Mongoose to ignore fields in the DB that aren't in the schema
  strict: false 
});

// Skip validation for existing documents
productSchema.pre('findOne', function() {
  this.setOptions({ strict: false });
});

productSchema.pre('find', function() {
  this.setOptions({ strict: false });
});

export default mongoose.model('Product', productSchema);