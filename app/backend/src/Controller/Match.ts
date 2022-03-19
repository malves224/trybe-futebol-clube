import { Response, Request } from 'express';
import MatchService from '../Service/MatchService';

const service = new MatchService();

export default class Match {
  static async getAll(req: Request, res: Response) {
    const { inProgress } = req.params;
    const matchsResponse = await service.getAll({ inProgress });
    res.status(200).json(matchsResponse);
  }

  static async create(req: Request, res: Response) {
    try {
      const responseCreate = await service.create(req.body);
      return res.status(201).json(responseCreate);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }

  static async finish(req: Request, res: Response) {
    const { id: idMatch } = req.params;
    try {
      await service.finish(idMatch as string);
      return res.status(200).end();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }
}
