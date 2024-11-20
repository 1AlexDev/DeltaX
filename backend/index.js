const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();

app.use(cors());
app.use(express.json());

async function chatResponse(msg) {
    const response = groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: msg,
            },
        ],
        model: "llama3-70b-8192",
    })
    return response;
}

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await chatResponse(message);
        console.log(response)

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch response from AI' });
    }
})

app.listen(5000, () => console.log('Backend is running.'))