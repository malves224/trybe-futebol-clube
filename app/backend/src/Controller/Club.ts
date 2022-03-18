import { Response, Request } from 'express';
import ClubService from '../Service/ClubService';

const service = new ClubService();

export default class Club {
  static async getAll(_req: Request, res: Response) {
    const allClubsResponse = await service.getAll();
    res.status(200).json(allClubsResponse);
  }
}

export const clubController = new Club();
