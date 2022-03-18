import Club from '../database/models/club';

export default class ClubService {
  model = Club;

  async getAll() {
    const response = await this.model.findAll();
    return response;
  }
}
