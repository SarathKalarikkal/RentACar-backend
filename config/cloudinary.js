import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage objects
const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pictures',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});
const DealerProfilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'dealer_profile_pictures',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

const carImagesStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'car_images',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

// Configure multer
export const uploadProfilePic = multer({ storage: profilePicStorage });
export const uploadCarImages = multer({ storage: carImagesStorage });
export const uploadDealerProfilePic = multer({ storage: DealerProfilePicStorage });


