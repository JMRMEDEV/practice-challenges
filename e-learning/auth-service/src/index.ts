import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersDb, refreshTokensDb } from './db';
import type { IUser, IRefreshToken, ITokenPayload } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const generateAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'running' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'student' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const allUsers = await usersDb.allDocs({ include_docs: true });
    const existing = allUsers.rows.find((row: any) => row.doc?.email === email);
    
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = {
      _id: `user_${Date.now()}_${Math.random()}`,
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    await usersDb.put(user);

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const allUsers = await usersDb.allDocs({ include_docs: true });
    const userRow = allUsers.rows.find((row: any) => row.doc?.email === email);
    
    if (!userRow || !userRow.doc) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userRow.doc as unknown as IUser;
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload: ITokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenDoc: IRefreshToken = {
      _id: `refresh_${Date.now()}_${Math.random()}`,
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    await refreshTokensDb.put(refreshTokenDoc);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ accessToken, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as ITokenPayload;

    const result = await refreshTokensDb.allDocs({ include_docs: true });
    const tokenDoc = result.rows.find(
      (row: any) => row.doc?.token === refreshToken && row.doc?.userId === decoded.userId
    );

    if (!tokenDoc || !tokenDoc.doc) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const payload: ITokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = generateAccessToken(payload);
    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

app.post('/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const result = await refreshTokensDb.allDocs({ include_docs: true });
      const tokenDoc = result.rows.find((row: any) => row.doc?.token === refreshToken);

      if (tokenDoc && tokenDoc.doc) {
        await refreshTokensDb.remove(tokenDoc.doc);
      }
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.get('/auth/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as ITokenPayload;

    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
