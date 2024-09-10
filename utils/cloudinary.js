import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

export const imageUploadCloudinary = async (filePath) => {
    try {
        const uploadResult = await cloudinaryInstance.uploader.upload(filePath);
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Error uploading to Cloudinary');
    }
};
