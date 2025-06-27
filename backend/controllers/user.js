import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = "yourSecretKey"; // Must match the secret used in auth.js

export const getUserProfile = async (req, res) => {
  try {
    console.log("Fetching profile for user:", req.user);
    
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required"
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Return user details
    return res.status(200).json({
      status: "ok",
      user_details: {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        contact_number: user.contact_number || "",
        personal_address: user.personal_address || "",
        business_name: user.business_name || "",
        business_email: user.business_email || "",
        business_contact_number: user.business_contact_number || "",
        business_address: user.business_address || "",
        business_account_number: user.business_account_number || "",
        business_gstin: user.business_gstin || "",
        business_about: user.business_about || ""
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error: " + error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    // Debug incoming request
    console.log('Received update profile request:');
    console.log('Headers:', req.headers);
    
    // Check the content type to handle different request formats
    const contentType = req.headers['content-type'] || '';
    console.log('Content-Type:', contentType);
    
    let updateData = {};
    
    // Handle FormData
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing multipart form data');
      
      // Check if fields are accessible in req.body
      console.log('Request body:', req.body);
      
      // Check if parsed JSON data is available
      if (req.body.jsonData) {
        try {
          updateData = JSON.parse(req.body.jsonData);
          console.log('Parsed JSON data:', updateData);
        } catch (e) {
          console.error('Error parsing jsonData:', e);
        }
      }
      
      // Fallback to individual fields if available
      if (Object.keys(updateData).length === 0) {
        const fields = [
          'user_name', 'email', 'contact_number', 'personal_address',
          'business_name', 'business_email', 'business_contact_number',
          'business_address', 'business_account_number', 'business_gstin',
          'business_about'
        ];
        
        fields.forEach(field => {
          if (req.body[field]) {
            updateData[field] = req.body[field];
          }
        });
      }
    } 
    // Handle JSON content type
    else if (contentType.includes('application/json')) {
      updateData = req.body;
    }
    
    console.log('Final update data:', updateData);
    
    // If no update data was found, try checking all possible sources
    if (Object.keys(updateData).length === 0) {
      // Try parsing the raw request body
      if (req.rawBody) {
        try {
          // If we have raw body, try to parse it
          updateData = JSON.parse(req.rawBody);
          console.log('Parsed from raw body:', updateData);
        } catch (e) {
          console.error('Failed to parse raw body:', e);
        }
      }
    }
    
    // If still no data, check for files
    if (Object.keys(updateData).length === 0 && req.files) {
      console.log('Files found:', Object.keys(req.files));
    }

    // Handle empty update case
    if (Object.keys(updateData).length === 0) {
      console.log('No update data found, sending empty success response');
      return res.status(200).json({
        success: true,
        message: "No changes detected",
        user_details: req.user
      });
    }

    // Proceed with update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user_details: user
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  console.log('Received update profile request:', {
    path: req.path,
    body: req.body,
    user: req.user?.email || 'Unknown user',
    contentType: req.headers['content-type']
  });

  // Validate input
  if (!req.user || !req.user._id) {
    console.error('Invalid user authentication');
    return res.status(401).json({
      status: 'error',
      message: 'Invalid user authentication'
    });
  }

  try {
    // First look for data in req.body directly
    let updateData = { ...req.body };
    
    // If body is empty but there's a jsonData field, use that
    if (Object.keys(updateData).length === 0 && req.body.jsonData) {
      try {
        updateData = JSON.parse(req.body.jsonData);
      } catch (e) {
        console.error('Error parsing jsonData:', e);
      }
    }
    
    // If we have a raw body and nothing else, try to parse that
    if (Object.keys(updateData).length === 0 && req.rawBody) {
      try {
        // If we have a Content-Type that includes multipart/form-data
        // we need to parse the individual form fields
        if (req.headers['content-type']?.includes('multipart/form-data')) {
          // Extracting fields from multipart form data is complex
          // For now, log what we have for debugging
          console.log('Multipart form data detected, form body:', req.body);
          
          // Try to use any fields that might have been successfully parsed by express
          const fields = [
            'user_name', 'email', 'contact_number', 'personal_address',
            'business_name', 'business_email', 'business_contact_number',
            'business_address', 'business_account_number', 'business_gstin', 
            'business_about'
          ];
          
          fields.forEach(field => {
            if (req.body[field]) {
              updateData[field] = req.body[field];
            }
          });
        } else {
          // For regular JSON, try to parse the raw body
          updateData = JSON.parse(req.rawBody);
        }
      } catch (e) {
        console.error('Error parsing raw request body:', e);
      }
    }
    
    console.log('Final update data:', updateData);
    
    // If we still don't have any update data, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No update data provided'
      });
    }

    // Find user by ID from the token
    const userId = req.user._id;
    console.log("Updating profile for user:", userId);

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    console.log("User profile updated successfully");
    return res.status(200).json({
      status: "ok",
      message: "Profile updated successfully",
      user_details: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error: " + error.message
    });
  }
};

// Add user count method for AdminDashboard
export const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error("Error fetching user count:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch user count" });
    }
};