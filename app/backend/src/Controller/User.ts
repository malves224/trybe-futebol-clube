import { Response, Request, NextFunction } from 'express';
import { validateToken } from '../auth/util';
import UserService from '../Service/User';
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

  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const response = await UserService.getUser(email, password);
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const dataToken = await validateToken(req.headers.authorization as string);
      return res.status(200).json(dataToken?.role);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).end();
      }
    }
  }
}

// export const UserControllers = new User(new UserSchema());

export default {
  loginUser: [User.validadeLogin, User.loginUser],
  validate: [User.validateToken],
};
