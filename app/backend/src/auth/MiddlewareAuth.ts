import { NextFunction, Request, Response } from 'express';
import Jwt from './Jwt';

export default class MiddlewareAuth {
  jwt = new Jwt();

  async authToken(req: Request, res: Response, next: NextFunction) {
    const { Authorization } = req.headers;
    if (!Authorization) {
      return res.status(401).json({ message: 'Token invalido' });
    }
    try {
      await this.jwt.validate(Authorization as string);
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: 'Token invalido' });
      }
    }
  }
}
