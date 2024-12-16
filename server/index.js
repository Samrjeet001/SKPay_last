import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

const app = express();

// CORS configuration to allow all origins
app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"] // Specify allowed methods
}));

app.use(express.json());
app.use('/auth', authRouter);

// No need for app.options('*', cors()) since the cors middleware handles preflight requests

app.get('/', (req, res) => {
    res.send("Welcome to the API!"); // Send a response to the client
});

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});