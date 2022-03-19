import { Response, Request } from 'express';
import MatchService from '../Service/MatchService';

const service = new MatchService();

export default class Match {
  static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    const matchsResponse = await service.getAll({ inProgress });
    res.status(200).json(matchsResponse);
  }

  // static async create(req: Request, res: Response) {

  // }
}
