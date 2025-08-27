import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcryptjs from "bcryptjs"

const JWT_SECRET = 'yourSecretKey'; // Hardcoded secret key

const register = async(req,res) => {

    const {user_name,password,email,role} = req.body;
    try{
        // Restrict Admin role to specific email only
        let userRole = role || 'Customer';
        if (userRole === 'Admin' && email !== 'harshavardhanreddyvanukuri26@gmail.com') {
            userRole = 'Customer'; // Force to Customer if not admin email
        }
        
        const newUser = new User({user_name,password,email,role: userRole});
        await newUser.save()

        res.json({
            "success":true,
            "message" : "User created successfully!"
        })
    }catch(err){
        res.json({
            "success":false,
            "message":`${err.message}`
        })
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body
    try{
        // Check for hardcoded admin login
        if(email === "harshavardhanreddyvanukuri26@gmail.com" && password === "harsha8485"){
            // Create or find admin user
            let adminUser = await User.findOne({email});
            if(!adminUser){
                // Create admin user if doesn't exist
                const hashedPassword = bcryptjs.hashSync("harsha8485", 10);
                adminUser = new User({
                    user_name: "admin",
                    email: "harshavardhanreddyvanukuri26@gmail.com",
                    password: hashedPassword,
                    role: "Admin"
                });
                await adminUser.save();
            }
            
            const token = jwt.sign(
                { 
                    id: adminUser._id,
                    email: adminUser.email,
                    role: adminUser.role
                },
                JWT_SECRET,
                { 
                    expiresIn: '24h',
                    algorithm: 'HS256'
                }
            );
            
            return res.json({
                success: true,
                token,
                user: {
                    _id: adminUser._id,
                    username: adminUser.email,
                    email: adminUser.email,
                    role: adminUser.role,
                }
            });
        }

        const validUser = await User.findOne({email})
        if(!validUser){
            return res.json({"success":false,"message":"No existing user with such email"})
        }
        const validPass = bcryptjs.compareSync(password,validUser.password)
        if(!validPass){
            return res.json({"success":false,"message":"Password incorrect"})
        }

        const token = jwt.sign(
            { 
                id: validUser._id,
                email: validUser.email,
                role: validUser.role
            },
            JWT_SECRET,
            { 
                expiresIn: '24h',
                algorithm: 'HS256' // Explicitly set the algorithm
            }
        );
        const {password:pass,...user} = validUser._doc
        return res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.email,
                email: user.email,
                role: user.role,
            }
        });

    }catch(err){
        res.json({
            "success":false,
            "message":`${err.message}`
        })
    }
}

const google = async (req, res) => {
    try {
      const { mode = 'login' } = req.body; // Get mode from request
      const vuser = await User.findOne({ email: req.body.email });
      
      if (vuser) {
        // User exists, proceed with login
        const token = jwt.sign(
          { 
            id: vuser._id,
            email: vuser.email,
            role: vuser.role
          }, 
          JWT_SECRET,
          { 
            expiresIn: '24h',
            algorithm: 'HS256'
          }
        );
        const { password: hashedPassword, ...user } = vuser._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          .json({
            success: true,
            token,
            user: {
              _id: user._id,
              username: user.email,
              email: user.email,
              role: user.role,
              profilePicture: user.profilePicture
            }
          });
      } else {
        // User doesn't exist
        if (mode === 'signup') {
          // Allow user creation for signup mode
          const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
          
          // Validate required fields before creating user
          if (!req.body.email || !req.body.name) {
            return res.status(400).json({
              success: false,
              message: "Missing required fields for Google OAuth signup",
              code: "MISSING_FIELDS"
            });
          }
          
          // Restrict Admin role to specific email only
          let userRole = req.body.role || 'Customer';
          if (userRole === 'Admin' && req.body.email !== 'harshavardhanreddyvanukuri26@gmail.com') {
            userRole = 'Customer'; // Force to Customer if not admin email
          }
          
          const newUser = new User({
            user_name:
              req.body.name.split(' ').join('').toLowerCase() +
              Math.random().toString(36).slice(-8),
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.photo || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
            role: userRole,
          });
          
          try {
            await newUser.save();
          } catch (saveError) {
            console.error('User save error:', saveError);
            return res.status(400).json({
              success: false,
              message: `Registration failed: ${saveError.message}`,
              code: "SAVE_ERROR"
            });
          }
          const token = jwt.sign(
            { 
              id: newUser._id,
              email: newUser.email,
              role: newUser.role
            }, 
            JWT_SECRET,
            { 
              expiresIn: '24h',
              algorithm: 'HS256'
            }
          );
          const { password: hashedPassword2, ...user } = newUser._doc;
          const expiryDate = new Date(Date.now() + 3600000); // 1 hour
          res
            .cookie('access_token', token, {
              httpOnly: true,
              expires: expiryDate,
            })
            .status(200)
            .json({
              success: true,
              token,
              user: {
                _id: user._id,
                username: user.email,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
              }
            });
        } else {
          // Login mode - don't create user, return error
          return res.status(401).json({
            success: false,
            message: "Account not found. Please register first or contact administrator if your account was deleted.",
            code: "ACCOUNT_NOT_FOUND"
          });
        }
      }
    } catch (error) {
        res.status(500).json({success:false,message:`${error.message}`})
    }
  };

const logout = (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Error during logout" });
  }
};

export default { register, login, google, logout };