import * as jwt from 'jsonwebtoken';
import * as rf from 'fs/promises';

export interface DataToken {
  id: number,
  username: string,
  role: string,
  email: string,
}

export default class Jwt {
  jwt = jwt;

  static secretKey = async () => rf.readFile('jwt.evaluation.key', 'utf-8');

  async validate(token: string) {
    const secret = await Jwt.secretKey();
    try {
      const dataToken = this.jwt.verify(token, secret);
      return dataToken as DataToken;
    } catch (error) {
      if (error instanceof Error) { throw error; }
    }
  }

  async generateToken(data: DataToken) {
    const secret = await Jwt.secretKey();
    const token = this.jwt.sign(data, secret, {
      expiresIn: '1d',
      algorithm: 'HS256',
    });
    return token;
  }
}
