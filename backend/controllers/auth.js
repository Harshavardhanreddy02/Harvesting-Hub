import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcryptjs from "bcryptjs"

const JWT_SECRET = 'yourSecretKey'; // Hardcoded secret key

const register = async(req,res) => {

    const {user_name,password,email,role} = req.body;
    try{
        const hashPassword = bcryptjs.hashSync(password,10);
        const newUser = new User({user_name,password:hashPassword,email,role});
        await newUser.save()

        res.json({
            "success":"true",
            "message" : "User created successfully!"
        })
    }catch(err){
        res.json({
            "success":"false",
            "message":`${err.message}`
        })
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body
    try{
        const validUser = await User.findOne({email})
        if(!validUser){
            return res.json({"success":"false","message":"No existing user with such email"})
        }
        const validPass = bcryptjs.compareSync(password,validUser.password)
        if(!validPass){
            return res.json({"success":"false","message":"Password incorrect"})
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
            "success":"false",
            "message":`${err.message}`
        })
    }
}

const google = async (req, res) => {
    try {
      const vuser = await User.findOne({ email: req.body.email });
      if (vuser) {
        const token = jwt.sign({ id: vuser._id }, "secret#token");
        const { password: hashedPassword, ...user } = vuser._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          .json({success:true,token,user});
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          user_name:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hashedPassword,
          profilePicture: req.body.photo,
          role: 'Customer',
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, "secret#token");
        const { password: hashedPassword2, ...user } = newUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
          .cookie('access_token', token, {
            httpOnly: true,
            expires: expiryDate,
          })
          .status(200)
          .json({success:true,token,user});
      }
    } catch (error) {
        res.json({success:false,message:`${error.message}`})
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