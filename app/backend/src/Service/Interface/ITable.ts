export interface ItableLeadorboardNumerics {
  totalPoints: number | string,
  totalGames: number | string,
  totalVictories: number | string,
  totalDraws: number | string,
  totalLosses: number | string,
  goalsFavor: number | string,
  goalsOwn: number | string,
  goalsBalance: number | string,
}

export default interface ITableLeaderboard extends ItableLeadorboardNumerics {
  name: string,
  efficiency: number | string,
}
