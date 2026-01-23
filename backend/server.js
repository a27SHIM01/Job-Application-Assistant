import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import fs from 'node:fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname || '.png'))
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.post('/api/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  res.json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

async function readTextFile(path) {
  try {
    const data = await fs.promises.readFile(path, { encoding: 'utf8' });
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

const instructions = await readTextFile("./backend/instructions.txt");

async function callGeminiAPI(model, prompt) {
  const parts = [
    instructions || '',
    prompt || ''
  ];

  if (myfile && myfile.uri) parts.push(createPartFromUri(myfile.uri, myfile.mimeType));
  if (myfile2 && myfile2.uri) parts.push(createPartFromUri(myfile2.uri, myfile2.mimeType));
  if (myfile3 && myfile3.uri) parts.push(createPartFromUri(myfile3.uri, myfile3.mimeType));
  parts.push('\nDOCUMENT END.');

  const response = await ai.models.generateContent({
    model,
    contents: createUserContent(parts),
    config: {
      tools: [{ "googleMaps": { } }],
    },
  });
  // console.log(response.text);
  return response.text
}

app.post('/api/generate', async (req, res) => {
  const { model, prompt } = req.body;
  try {
    const reply = await callGeminiAPI(model, prompt);
    // console.log(reply);
    res.json(reply);
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Failed to call Gemini API' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on http://localhost:' + PORT));