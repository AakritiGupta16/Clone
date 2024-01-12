// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY;

const app = express();
app.use(express.json());
app.use(cors({ origin: 'frontend origin' })); // Replace with your frontend's origin

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const PLAYHT_API_ENDPOINT = 'https://api.play.ht/api/v1/ssml';

// Endpoint for OpenAI requests
app.post('/openai', async (req, res) => {
    try {
        const requestBody = {
            ...req.body,
            model: "gpt-4", // Replace with your desired model
            messages: req.body.messages
        };

        const response = await fetch(OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint for Play.ht requests
app.post('/playht', async (req, res) => {
    try {
        const response = await fetch(PLAYHT_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PLAYHT_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
