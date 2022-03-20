import Club from '../database/models/club';
import Match from '../database/models/match';
import IMatch, { IScoreboard, ITeams } from './Interface/IMatch';

export default class MatchService {
  modelMatch = Match;

  includeClubs = { include: [
    { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
    { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
  ],
  };

  private async checkIfMatchExist(idMatch: number | string) {
    const response = await this.modelMatch.findOne({ where: { id: idMatch } });
    if (!response) {
      throw new Error('id match does not exist');
    }
  }

  private async checkIfTeamsExists(teamsListIds: number[]) {
    const listPromise = teamsListIds
      .map((team) => this.modelMatch.findOne({ where: { id: team } }));

    const teams = await Promise.all(listPromise).then((res) => res);
    if (teams.some((team) => !team)) {
      throw new Error('There is no team with such id!');
    }
  }

  private static checkIfTeamEquals(teams: ITeams) {
    if (teams.awayTeam === teams.homeTeam) {
      throw new Error('It is not possible to create a match with two equal teams');
    }
  }

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

  async create(match: IMatch) {
    MatchService.checkIfTeamEquals(match);
    await this.checkIfTeamsExists([match.homeTeam, match.awayTeam]);

    const { awayTeam, homeTeam, homeTeamGoals, awayTeamGoals } = match;
    const responseCreate = await this.modelMatch.create({
      awayTeam, homeTeam, homeTeamGoals, awayTeamGoals, inProgress: true,
    });

    return { id: responseCreate.id, ...match };
  }

  async finish(idMatch: number | string) {
    await this.modelMatch.update({ inProgress: false }, { where: { id: idMatch } });
  }

  async editScoreboard(idMatch: number | string, newScoreboard: IScoreboard) {
    const { awayTeamGoals, homeTeamGoals } = newScoreboard;
    await this.modelMatch.update({ awayTeamGoals, homeTeamGoals }, { where: { id: idMatch } });
  }
}
