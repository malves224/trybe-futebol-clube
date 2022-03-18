import Club from '../database/models/club';

export default class ClubService {
  model = Club;

  async getAll() {
    const response = await this.model.findAll();
    return response;
  }

  async getOne(id: string | number) {
    const response = await this.model.findOne({ where: { id } });
    if (!response) {
      throw new Error('id does not exist');
    }
    return response;
  }
}
