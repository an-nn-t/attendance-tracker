// src/lib/auth.ts
import jwt from 'jsonwebtoken';

// 開発環境用のフォールバックシークレット（本番環境では必ず .env に JWT_SECRET を設定してください）
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' }); // 1週間有効
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}