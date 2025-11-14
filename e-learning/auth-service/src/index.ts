import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'running' });
});

app.post('/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint - not implemented yet' });
});

app.post('/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint - not implemented yet' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
