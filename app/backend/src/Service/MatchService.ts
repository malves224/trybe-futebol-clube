import Club from '../database/models/club';
import Match from '../database/models/match';

export default class MatchService {
  modelMatch = Match;

  includeClubs = { include: [
    { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
    { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
  ],
  };

  private static transformBool(value: string) {
    let output = false;
    if (value === 'true') {
      output = true;
    }
    return output;
  }

  async getAll(searchColumn?: any) {
    const whereSanitized = {
      ...searchColumn,
      inProgress: MatchService.transformBool(searchColumn.inProgress),
    };

    const allMatch = await this.modelMatch.findAll({
      where: { ...whereSanitized },
      ...this.includeClubs,
    });
    return allMatch;
  }
}
