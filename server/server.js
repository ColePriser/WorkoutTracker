
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://colepriser:Lgwhic7kqcpCmHlM@cluster0.iriij.mongodb.net/gymDatabase?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

// Hello World Demo
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World! Cole Priser CS348 Project' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
