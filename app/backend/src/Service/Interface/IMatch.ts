export interface ITeams {
  'homeTeam': number
  'awayTeam': number,
}

export interface IScoreboard {
  'homeTeamGoals': number | string,
  'awayTeamGoals': number | string,
}

export default interface IMatch extends ITeams, IScoreboard {
  'inProgress': boolean
}
