import Joi = require('joi');

export default class UserSchema {
  schema = Joi.object({
    email: Joi.required(),
    password: Joi.required(),
  });;

  async validateData(dataToVerify: any) {
    try {
      await this.schema.validateAsync(dataToVerify);
    } catch (error) {
      if (error instanceof Error) {
        error.message = 'All fields must be filled';
        throw error;
      }
    }
  }
}
