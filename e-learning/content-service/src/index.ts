import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'content-service', status: 'running' });
});

app.get('/courses', (req, res) => {
  res.json({ message: 'Courses endpoint - not implemented yet' });
});

app.get('/courses/:id', (req, res) => {
  res.json({ message: 'Course details endpoint - not implemented yet' });
});

app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});
