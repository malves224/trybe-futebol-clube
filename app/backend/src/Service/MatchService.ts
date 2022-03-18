import Club from '../database/models/club';
import Match from '../database/models/match';

export default class MatchService {
  modelMatch = Match;

  includeClubs = { include: [
    { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
    { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
  ],
  };

  private static checkQueryParam(value: string) {
    if (value === 'true') {
      return { inProgress: true };
    } if (value === 'false') {
      return { inProgress: false };
    }
    return {};
  }

  async getAll(searchColumn?: any) {
    const inProgress = MatchService.checkQueryParam(searchColumn.inProgress);

    const allMatch = await this.modelMatch.findAll({
      where: { ...inProgress },
      ...this.includeClubs,
    });
    return allMatch;
  }
}
