export interface ITeams {
  'homeTeam': number
  'awayTeam': number,
}

export default interface IMatch extends ITeams {
  'homeTeamGoals': number,
  'awayTeamGoals': number,
  'inProgress': boolean
}
