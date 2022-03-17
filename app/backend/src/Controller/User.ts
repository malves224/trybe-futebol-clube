import { Response, Request, NextFunction } from 'express';
import UserSchema from '../schema/User';

export class User {
  static async validadeLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const schema = new UserSchema();
    try {
      await schema.validateData({ email, password });
      next();
    } catch ({ message }) {
      return res.status(401).json({ message });
    }
  }

  static loginUser(req: Request, res: Response) {
    console.log(req.body);
    return res.status(200).json('ok');
  }
}

export default {
  loginUser: [User.validadeLogin, User.loginUser],
};
