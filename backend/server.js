import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import multer from 'multer';
import path from 'path';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function readTextFile(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    // console.log(data);
    return data;
  } catch (err)  {
    console.error(err);
  }
}

async function callGeminiAPI(prompt){ 
  const instructions = await readTextFile("./backend/instructions.txt");
  const full_prompt = instructions + prompt + "\nDOCUMENT END.";
  console.log(full_prompt);
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: full_prompt,
  });
  // console.log(response.text);
  return response.text
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

app.post("/api/upload", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    file: req.file.filename
  })
  console.log(req.file.filename);
})

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const reply = await callGeminiAPI(prompt);
    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Failed to call Gemini API' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on http://localhost:' + PORT));