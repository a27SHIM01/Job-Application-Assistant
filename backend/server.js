import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
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

const myfile = await ai.files.upload({
  file: "./uploads/job_pt1.png",
  // config: { mimeType: "image/jpeg" },
});
const myfile2 = await ai.files.upload({
  file: "./uploads/job_pt2.png",
  // config: { mimeType: "image/jpeg" },
});
const myfile3 = await ai.files.upload({
  file: "./uploads/job_pt3.png",
  // config: { mimeType: "image/jpeg" },
});
// console.log("Uploaded file:", myfile);



async function callGeminiAPI(prompt){ 
  const instructions = await readTextFile("./backend/instructions.txt");
  // const full_prompt = instructions + prompt + "\nDOCUMENT END.";
  // console.log(full_prompt);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      instructions,
      prompt,
      createPartFromUri(myfile.uri, myfile.mimeType),
      createPartFromUri(myfile2.uri, myfile2.mimeType),
      createPartFromUri(myfile3.uri, myfile3.mimeType),
      "\nDOCUMENT END.",
    ]),
    config: {
      tools: [{ "googleMaps": { } }],
    },
  });
  // console.log(response.text);
  return response.text
}

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