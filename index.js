import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/index.js';
import { PORT } from './config/variables.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Define and create the upload directory if it does not exist
const uploadDir = path.join(__dirname, 'temp-uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
} else {
    console.log(`Directory already exists: ${uploadDir}`);
}

// Serve static files from the upload directory
app.use('/uploads', express.static(uploadDir));

// Middleware setup
app.use(cors({
    origin: "https://rent-a-car-amber.vercel.app/",
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Connect to the database
connectDB();

// Set up API routes
app.use('/api', apiRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
