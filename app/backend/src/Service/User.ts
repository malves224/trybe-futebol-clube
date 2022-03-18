import * as bcrypt from 'bcryptjs';
import generateToken from '../auth/util';
import User from '../database/models/user';

export default class UserService {
  private static async verifyLogin(email: string, password: string) {
    const response = await User.findOne({ where: { email } });
    if (!response) {
      throw new Error('Incorrect email or password');
    }
    const passwordIsValid = await bcrypt.compare(password, response.password);
    if (!passwordIsValid) {
      throw new Error('Incorrect email or password');
    }
    return response;
  }

  static async getUser(emailToVerify: string, password: string) {
    const response = await UserService.verifyLogin(emailToVerify, password);
    const { id, username, role, email } = response;
    const token = await generateToken({ id, username, role, email });
    return {
      user: {
        id, username, role, email,
      },
      token,
    };
  }
}
