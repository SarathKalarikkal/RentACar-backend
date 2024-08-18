import multer from 'multer';

// Configure multer storage (you can use memory storage as cloudinary will handle the file)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;