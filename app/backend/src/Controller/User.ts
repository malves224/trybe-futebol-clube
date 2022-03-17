import { Response, Request, NextFunction } from 'express';
import UserSchema from '../schema/User';

const schema = new UserSchema();

export class User {
  static async validadeLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      await schema.validateData({ email, password });
      next();
    } catch ({ message }) {
      return res.status(401).json({ message });
    }
  }

  static loginUser(req: Request, res: Response) {
    return res.status(200).json('ok');
  }
}

// export const UserControllers = new User(new UserSchema());

export default {
  loginUser: [User.validadeLogin, User.loginUser],
};
