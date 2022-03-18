import * as jwt from 'jsonwebtoken';
import * as rf from 'fs/promises';

export interface DataToken {
  id: number,
  username: string,
  role: string,
  email: string,
}

const secretKey = async () => rf.readFile('jwt.evaluation.key', 'utf-8');

export async function validateToken(token:string) {
  const secret = await secretKey();
  try {
    const dataToken = jwt.verify(token, secret);
    return dataToken as DataToken;
  } catch (error) {
    if (error instanceof Error) { throw error; }
  }
}

export default async function generateToken(data: DataToken) {
  const secret = await rf.readFile('jwt.evaluation.key', 'utf-8');
  const token = jwt.sign(data, secret, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
  return token;
}
