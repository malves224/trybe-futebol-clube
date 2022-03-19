import { NextFunction, Request, Response } from 'express';
import Jwt from './Jwt';

const jwt = new Jwt();

export default class MiddlewareAuth {
  static async authToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token invalido' });
    }

    try {
      await jwt.validate(authorization);
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }
}
