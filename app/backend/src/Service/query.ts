export type FilterLeaderboard = 'home_team' | 'away_team';

const generateQueryAwayOrHome = (filter: FilterLeaderboard) => {
  const oppositeFilter = filter === 'home_team' ? 'away_team' : 'home_team';

  return `SELECT clb.club_name as name,
  (count(if(${filter}_goals > ${oppositeFilter}_goals, clb.id, null)) * 3 
  + count(if(${filter}_goals = ${oppositeFilter}_goals, clb.id, null))) as totalPoints,
  count(clb.id) as totalGames,
  count(if(${filter}_goals > ${oppositeFilter}_goals, clb.id, null)) as totalVictories,
  count(if(${filter}_goals = ${oppositeFilter}_goals, clb.id, null)) as totalDraws,
  count(if(${filter}_goals < ${oppositeFilter}_goals, clb.id, null)) as totalLosses,
  sum(${filter}_goals) as goalsFavor,
  sum(${oppositeFilter}_goals) as goalsOwn,
  sum(${filter}_goals) - sum(${oppositeFilter}_goals) as goalsBalance
  FROM TRYBE_FUTEBOL_CLUBE.matchs as mat
  INNER JOIN TRYBE_FUTEBOL_CLUBE.clubs as clb ON ${filter} = clb.id
  WHERE in_progress = 0
  GROUP BY clb.id
  ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC, goalsOwn;  
`;
};

export default generateQueryAwayOrHome;
