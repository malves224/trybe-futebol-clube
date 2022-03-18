import * as jwt from 'jsonwebtoken';
import * as rf from 'fs/promises';

export interface DataToken {
  id: number,
  username: string,
  role: string,
  email: string,
}

export default async function generateToken(data: DataToken) {
  const secret = await rf.readFile('jwt.evaluation.key', 'utf-8');
  const token = jwt.sign(data, secret, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
  return token;
}
