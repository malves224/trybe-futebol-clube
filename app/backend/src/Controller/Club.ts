import { Response, Request } from 'express';
import ClubService from '../Service/ClubService';

const service = new ClubService();

export default class Club {
  static async getAll(_req: Request, res: Response) {
    const allClubsResponse = await service.getAll();
    res.status(200).json(allClubsResponse);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const clubResponse = await service.getOne(id);
      return res.status(200).json(clubResponse);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }
}

export const clubController = new Club();
