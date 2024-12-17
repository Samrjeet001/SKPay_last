import express from 'express';
import cors from 'cors';
import path from 'path'; // Import path module
import authRouter from './routes/authRoutes.js';

// Function to get __dirname in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

// CORS configuration to allow all origins
app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"] // Specify allowed methods
}));

app.use(express.json());
app.use('/auth', authRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build'))); // Adjust the path as necessary

// Catch-all handler to serve index.html for any route not handled by the API

// API root route
app.get('/', (req, res) => {
    res.send("Welcome to the API!"); // Send a response to the client
});

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
