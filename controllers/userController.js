import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateToken.js";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";


// Create User
export const userCreate = async (req, res, next) => {
    try {

            const { name, email, password, role } = req.body;

            // console.log(req.file);
            

            // const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path).catch((error)=>{
            //     console.log(error);
                
            // })
            // console.log(uploadResult.url)


            if (!name || !email || !password || !role ) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }


            const userExist = await User.findOne({ email });

            if (userExist) {
                return res.status(409).json({ success: false, message: "User already exists" });
            }

            // Hashing the password
            const salt = 10;
            const hashedPassword = bcrypt.hashSync(password, salt);

            

            // Create new user
            // const newUser = new User({ name, email, password: hashedPassword, mobile, profilePic: uploadResult.url });
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();

            const id = newUser._id.toString();
            const UserRole = newUser.role;

            // Create token
            const token = generateToken(id, email, UserRole);

            res.cookie("token", token);
            return res.status(201).json({ success: true, message: "User created successfully", userData : newUser,token:token });
        
    } catch (error) {
        return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// User Login
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const id = userExist._id.toString();
        const role = userExist.role;

        // Create token
        const token = generateToken(id, email, role);

        res.cookie("token", token, {
            sameSite: "None",
            secure: true,
            httpOnly: true,
        });
        return res.status(200).json({ success: true, message: "User logged in successfully",role:userExist.role, userData:userExist, token:token });

    } catch (error) {
        return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
    }
};


// User logout
export const userLogout = async (req, res, next) => {
   try {
    
    res.clearCookie("token");

    return res.status(200).json({ success: true, message: "User logged out successfully" });
   } catch (error) {
    return  res.status(error.status || 500).json({success: false, message: error.message || "Internal server error" });
   }
};


//user Profile
export const userProfile = async (req, res, next) => {
   try {
       const { id } = req.params;
       
       
       const userData = await User.findById(id).select("-password");

       return res.status(200).json({ success: true, message: "user data fetched", data: userData });
   } catch (error) {
       res.status(error.status || 500).json({success: false, message: error.message || "Internal server error" });
   }
};


//User auth
export const checkUser = async (req, res, next) => {
   try {
       const user = req.user;

       if (!user) {
           return res.status(401).json({ success: false, message: "user not authenticated" });
       }
       return  res.status(200).json({ success: true, message: "User authenticated" });
   } catch (error) {
    return res.status(error.status || 500).json({success: false, message: error.message || "Internal server error" });
   }
};


export const getAllUsers = async(req, res, next)=>{
     try {
        const users = await User.find();
        return res.json({ success: true, message: "Users fetched successfully", data: users });
     } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
     }
}