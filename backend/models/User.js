import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Customer', 'Farmer', 'Admin'], // Match frontend capitalization
    default: 'Customer'
  },
  personal_address: {
    type: String,
    default: ''
  },
  contact_number: {
    type: String,
    default: ''
  },
  profile_image_id: {
    type: String,
    default: 'default.png'
  },
  business_name: {
    type: String,
    default: ''
  },
  business_email: {
    type: String,
    default: ''
  },
  business_contact_number: {
    type: String,
    default: ''
  },
  business_address: {
    type: String,
    default: ''
  },
  business_account_number: {
    type: String,
    default: ''
  },
  business_gstin: {
    type: String,
    default: ''
  },
  business_about: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'
  },
  wishlist: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Normalize role before validation and saving
userSchema.pre('validate', function(next) {
  if (this.role) {
    this.role = this.role.charAt(0).toUpperCase() + this.role.slice(1).toLowerCase();
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add proper validation for update operations
userSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Log the update operation for debugging
  console.log('User update operation:', update);
  
  // Normalize role to match enum values
  if (update.$set && update.$set.role) {
    update.$set.role = update.$set.role.charAt(0).toUpperCase() + update.$set.role.slice(1).toLowerCase();
  }
  if (update.role) {
    update.role = update.role.charAt(0).toUpperCase() + update.role.slice(1).toLowerCase();
  }
  
  // Remove any empty strings for optional fields to prevent overwriting with empty values
  if (update.$set) {
    Object.keys(update.$set).forEach(key => {
      if (update.$set[key] === '') {
        delete update.$set[key];
      }
    });
  }
  
  next();
});


// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if model exists before creating it
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;