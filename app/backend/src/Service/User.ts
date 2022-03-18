import * as bcrypt from 'bcryptjs';
import Jwt from '../auth/Jwt';
import User from '../database/models/user';

export default class UserService {
  private model = User;

  private jwt = new Jwt();

  private async verifyLogin(email: string, password: string) {
    const response = await this.model.findOne({ where: { email } });
    if (!response) {
      throw new Error('Incorrect email or password');
    }
    const passwordIsValid = await bcrypt.compare(password, response.password);
    if (!passwordIsValid) {
      throw new Error('Incorrect email or password');
    }
    return response;
  }

  async getUser(emailToVerify: string, password: string) {
    const response = await this.verifyLogin(emailToVerify, password);
    const { id, username, role, email } = response;
    const token = await this.jwt.generateToken({ id, username, role, email });
    return {
      user: {
        id, username, role, email,
      },
      token,
    };
  }
}
