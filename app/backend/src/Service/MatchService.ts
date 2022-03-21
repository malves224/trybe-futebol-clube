import { QueryTypes } from 'sequelize';
import Club from '../database/models/club';
import Match from '../database/models/match';
import IMatch, { IScoreboard, ITeams } from './Interface/IMatch';
import sequelize from '../database/models';
import ITableLeaderboard from './Interface/ITable';
import generateQueryAwayOrHome from './query';

export type FilterLeaderboard = 'home' | 'away' | 'all';

export default class MatchService {
  modelMatch = Match;

  sequelizeModel = sequelize;

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

  static formatLeaderBoard(table: ITableLeaderboard[]) {
    const tableFormated = table.map((row) => ({
      ...row,
      totalPoints: +row.totalPoints,
      totalGames: +row.totalGames,
      totalVictories: +row.totalVictories,
      totalDraws: +row.totalDraws,
      totalLosses: +row.totalLosses,
      goalsFavor: +row.goalsFavor,
      goalsOwn: +row.goalsOwn,
      goalsBalance: +row.goalsBalance,
      efficiency: +((+row.totalPoints / (+row.totalGames * 3)) * 100).toFixed(2),
    }));
    return tableFormated;
  }

  async generateLeaderboard(filter: FilterLeaderboard) {
    if (filter === 'all') {
      // querry table all
      return [{
        name: 'Santos',
        totalPoints: 9,
      }];
    }
    const filterQuery = filter === 'home' ? 'home_team' : 'away_team';

    const responseQuery = await this.sequelizeModel
      .query(generateQueryAwayOrHome(filterQuery), {
        replacements: { filterQuery },
        type: QueryTypes.SELECT,
      });

    const leaderBoardFormated = MatchService
      .formatLeaderBoard(responseQuery as ITableLeaderboard[]);

    return leaderBoardFormated;
  }
}
