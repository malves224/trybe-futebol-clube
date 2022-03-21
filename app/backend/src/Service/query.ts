export type FilterLeaderboard = 'home_team' | 'away_team';

const generateQueryAwayOrHome = (mandante: FilterLeaderboard, visitante: FilterLeaderboard) =>
  `SELECT clb.club_name as name,
  (count(if(${mandante}_goals > ${visitante}_goals, clb.id, null)) * 3 
  + count(if(${mandante}_goals = ${visitante}_goals, clb.id, null))) as totalPoints,
  count(clb.id) as totalGames,
  count(if(${mandante}_goals > ${visitante}_goals, clb.id, null)) as totalVictories,
  count(if(${mandante}_goals = ${visitante}_goals, clb.id, null)) as totalDraws,
  count(if(${mandante}_goals < ${visitante}_goals, clb.id, null)) as totalLosses,
  sum(${mandante}_goals) as goalsFavor,
  sum(${visitante}_goals) as goalsOwn,
  sum(${mandante}_goals) - sum(${visitante}_goals) as goalsBalance
  FROM TRYBE_FUTEBOL_CLUBE.matchs as mat
  INNER JOIN TRYBE_FUTEBOL_CLUBE.clubs as clb ON ${mandante} = clb.id
  WHERE in_progress = 0
  GROUP BY clb.id
  ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC, goalsOwn;
  `;

export default generateQueryAwayOrHome;
