import { QueryTypes } from 'sequelize';
import Club from '../database/models/club';
import Match from '../database/models/match';
import IMatch, { IScoreboard, ITeams } from './Interface/IMatch';
import sequelize from '../database/models';
import ITableLeaderboard, { ItableLeadorboardNumerics } from './Interface/ITable';
import generateQueryAwayOrHome from './query';
import ISortConfig from './Interface/ISort';

export type FilterLeaderboard = 'home' | 'away' | 'all';

export default class MatchService {
  modelMatch = Match;

  sequelizeModel = sequelize;

  criterionTiebreake = [
    { columnName: 'totalPoints', desc: true },
    { columnName: 'totalVictories', desc: true },
    { columnName: 'goalsBalance', desc: true },
    { columnName: 'goalsFavor', desc: true },
    { columnName: 'goalsOwn' },
  ];

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
      efficiency: MatchService.getEfficiency(row),
    }));
    return tableFormated;
  }

  static sortTiebreaker(listForSort: any[], listCriterion: ISortConfig[]) {
    const callBackSort = ((a: number, b: number) => {
      let [output, needTiebreaker] = [0, true];
      listCriterion.forEach((column) => {
        const [maior, menor] = column.desc ? [-1, 1] : [1, -1];
        const currentColumn = (a as never)[column.columnName];
        const nextColumn = (b as never)[column.columnName];
        if (needTiebreaker) {
          if (currentColumn > nextColumn) { output = maior; needTiebreaker = false; }
          if (currentColumn < nextColumn) { output = menor; needTiebreaker = false; }
        }
      });
      return output;
    });
    return listForSort.sort(callBackSort);
  }

  private static getEfficiency(rowTalbe: ItableLeadorboardNumerics) {
    return +((+rowTalbe.totalPoints / (+rowTalbe.totalGames * 3)) * 100).toFixed(2);
  }

  private async joinLeaderBoard() {
    const [tableInHome, tableIAway] = await Promise.all([
      this.getLeaderboard('home'), this.getLeaderboard('away'),
    ]);
    const leaderboardAll: ITableLeaderboard[] = tableInHome.map((homeClub) => {
      const dataAway = tableIAway.find((awayClub) => homeClub.name === awayClub.name) as any;
      const dataHome = { ...homeClub } as any;
      const newRow: any = {};
      const columnLeaderBoard = Object.keys(dataHome);
      columnLeaderBoard.forEach((column) => {
        const columnValue: string | number = dataAway[column];
        if (typeof columnValue === 'number') { newRow[column] = columnValue + dataHome[column]; }
      });
      return { ...homeClub,
        ...newRow,
        efficiency: MatchService.getEfficiency(newRow) };
    });

    return MatchService.sortTiebreaker(leaderboardAll, this.criterionTiebreake);
  }

  async getLeaderboard(homeOrAway: 'home' | 'away') {
    const filterQuery = homeOrAway === 'home' ? 'home_team' : 'away_team';

    const responseQuery = await this.sequelizeModel
      .query(generateQueryAwayOrHome(filterQuery), {
        replacements: { filterQuery },
        type: QueryTypes.SELECT,
      });

    const leaderBoardFormated = MatchService
      .formatLeaderBoard(responseQuery as ITableLeaderboard[]);

    return leaderBoardFormated;
  }

  async generateLeaderboard(filter: FilterLeaderboard) {
    if (filter === 'all') {
      const leaderBoardAll = this.joinLeaderBoard();
      return leaderBoardAll;
    }

    const leaderBoardFormated = this.getLeaderboard(filter);
    return leaderBoardFormated;
  }
}
