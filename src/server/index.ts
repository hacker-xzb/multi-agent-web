import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const messagesDir = path.join(__dirname, '../../messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir);
}

app.post('/api/save-messages', (req, res) => {
  try {
    const messages = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `messages_${timestamp}.json`;
    const filepath = path.join(messagesDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(messages, null, 2));
    res.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving messages:', error);
    res.status(500).json({ success: false, error: 'Failed to save messages' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 