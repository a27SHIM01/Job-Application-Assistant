import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    res.json({ text: response.text ?? response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));