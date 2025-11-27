import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3003;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://localhost:3002';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/verify`, {
      headers: { Authorization: authHeader },
    });

    (req as any).user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/health', (req, res) => {
  res.json({ service: 'bff', status: 'running' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);

    if (response.headers['set-cookie']) {
      res.setHeader('Set-Cookie', response.headers['set-cookie']);
    }

    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Login failed' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/refresh`,
      {},
      {
        headers: { Cookie: req.headers.cookie || '' },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 401).json(error.response?.data || { error: 'Refresh failed' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/logout`,
      {},
      {
        headers: { Cookie: req.headers.cookie || '' },
      }
    );

    res.clearCookie('refreshToken');
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Logout failed' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const response = await axios.get(`${CONTENT_SERVICE_URL}/courses`, { params: req.query });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch courses' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const response = await axios.get(`${CONTENT_SERVICE_URL}/courses/${req.params.id}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch course' });
  }
});

app.post('/api/courses', authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${CONTENT_SERVICE_URL}/courses`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to create course' });
  }
});

app.delete('/api/courses/:id', authMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(`${CONTENT_SERVICE_URL}/courses/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to delete course' });
  }
});

app.post('/api/enrollments', authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${CONTENT_SERVICE_URL}/enrollments`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to enroll' });
  }
});

app.get('/api/user/enrollments', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const response = await axios.get(`${CONTENT_SERVICE_URL}/enrollments/user/${userId}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch enrollments' });
  }
});

app.put('/api/enrollments/:id/progress', authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(`${CONTENT_SERVICE_URL}/enrollments/${req.params.id}/progress`, req.body);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to update progress' });
  }
});

app.get('/api/user/profile', authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});

app.listen(PORT, () => {
  console.log(`BFF running on port ${PORT}`);
});
