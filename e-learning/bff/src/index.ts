import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ service: 'bff', status: 'running' });
});

app.get('/api/user/profile', (req, res) => {
  res.json({ message: 'User profile endpoint - not implemented yet' });
});

app.get('/api/courses', (req, res) => {
  res.json({ message: 'Courses API endpoint - not implemented yet' });
});

app.listen(PORT, () => {
  console.log(`BFF running on port ${PORT}`);
});
