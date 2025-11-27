export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

export interface IRefreshToken {
  _id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}
