
const CURRENT_SEASON = 10001;

// reusable functions

const _getGameById = async (db, game_id) => {
    const gameLookup = await db.games.findOne({ game_id });
    // console.log(gameLookup, 'gameLookup');
    if (!gameLookup) {
        return false;
    }
    const gameStats = await db.game_team_stats.findOne({ game_id });
    const query = `
        select * from game_player_stats gps
        join players p on p.player_id = gps.player_id
        where gps.game_id = $1 and gps.season_id = $2
    `;
    const playersLookup = await db.query(query, [game_id, gameLookup.season_id]);
    return { ...gameLookup, ...gameStats, player_stats: playersLookup };
};


const getGames = async (req, res) => {
    const db = req.app.get('db');
    // const playersLookup = await db.players.find({}, { fields: ['player_id', 'first_name'] });
    const gamesLookup = await db.games.find({
        season_id: CURRENT_SEASON,
    }, {
        order: [{
            field: 'start_date',
            direction: 'asc',
        }],
    });

    // const query = `
    //     select * from players p
    //     join player_season_stats pss on pss.player_id = p.player_id
    //     join seasons s on s.id = pss.season_id
    //     where season_id = $1
    // `;

    // const gamesLookup = await db.query(query, [10001]);

    console.log(gamesLookup, 'gamesLookup');


    return res.send({ status: 200, data: gamesLookup, message: 'Retrieved list of games' });
};


const getGameById = async (req, res) => {
    const db = req.app.get('db');
    const { game_id } = req.params;
    // const { season_id } = req.body;
    // const playersLookup = await db.players.find({}, { fields: ['player_id', 'first_name'] });
    // const gameLookup = await db.games.findOne({ game_id });

    // console.log(gameLookup, 'gameLookup');

    // if (!gameLookup) {
    //     return res.send({ status: 404, data: [], message: 'Game does not exist' });
    // }

    // const bb = await db.game_team_stats.findOne({ game_id });


    // const query = `
    //     select * from game_player_stats gps
    //     join players p on p.player_id = gps.player_id
    //     where gps.game_id = $1 and gps.season_id = $2
    // `;

    // const playersLookup = await db.query(query, [game_id, gameLookup.season_id]);

    // console.log(playersLookup, 'playersLookup')

    const data = await _getGameById(db, game_id);

    if (data === false) {
        return res.send({ status: 404, data: [], message: 'Game does not exist' });
    }

    return res.send({ status: 200, data, message: 'Retrieved game' });
};

const createGame = async (req, res) => {
    const db = req.app.get('db');

    const { opponent, start_date, is_home, location } = req.body;

    const season_id = CURRENT_SEASON;

    // console.log({ opponent, start_date, is_home }, 'createGame');

    // TODO: set uet up random player id with nanoid - npm install
    const rnd = Math.floor(Math.random() * 10000);


    const data = await db.games.insert({ game_id: rnd, season_id, opponent, location, start_date, is_home });
    await db.game_team_stats.insert({ game_id: rnd, season_id });
    // console.log(data,'daattttaaa')
    return res.send({ status: 200, data, message: 'Game created' });
};

const updateGame = async (req, res) => {
    const db = req.app.get('db');

    console.log(req.params);
    // console.log(req.body);

    const { game_id } = req.params;
    const { opponent, location, start_date, is_home,
        opponent_faceoffs_won,
        opponent_goals_against,
        opponent_ground_balls,
        opponent_penalties_in_minutes,
        opponent_scores_first,
        opponent_scores_second,
        opponent_scores_third,
        opponent_scores_fourth,
        opponent_scores_overtime,
        opponent_shots,
        us_scores_first,
        us_scores_second,
        us_scores_third,
        us_scores_fourth,
        us_scores_overtime,
    } = req.body;

    const opponentGoalsFor = opponent_scores_first + opponent_scores_second + opponent_scores_third + opponent_scores_fourth + opponent_scores_overtime;
    const usGoalsFor = us_scores_first + us_scores_second + us_scores_third + us_scores_fourth + us_scores_overtime;
    const goalDifferential = usGoalsFor - opponentGoalsFor;
    // const result = goalDifferential > 0 ? 'W' : 'L';

    let result = null;
    if (goalDifferential === 0) {
        result = 'T';
    } else if (goalDifferential > 0) {
        result = 'W';
    } else {
        result = 'L';
    }


    // console.log(goalDifferential, 'goalDifferential')
    // console.log(result, 'bbbbbbb')

    const [d] = await db.games.update({ game_id }, {
        opponent,
        location,
        start_date,
        is_home,
        result,
        goal_differential: goalDifferential,
        goals_for: usGoalsFor,
        goals_against: opponentGoalsFor,
    });
    const [b] = await db.game_team_stats.update({ game_id }, {
        opponent_faceoffs_won,
        opponent_goals_against,
        opponent_ground_balls,
        opponent_penalties_in_minutes,
        opponent_shots,
        opponent_scores_first,
        opponent_scores_fourth,
        opponent_scores_overtime,
        opponent_scores_second,
        opponent_scores_third,
        opponent_goals_for: opponentGoalsFor,

        us_scores_first,
        us_scores_second,
        us_scores_third,
        us_scores_fourth,
        us_scores_overtime,
        us_goals_for: usGoalsFor,
    });

    // console.log(b, 'bbbbb')

    // console.log(d, 'ddddd')

    const query = `
        select * from game_player_stats gps
        join players p on p.player_id = gps.player_id
        where gps.game_id = $1 and gps.season_id = $2
    `;

    const playersLookup = await db.query(query, [game_id, b.season_id]);

    console.log(playersLookup, 'playersLookup update game')

    return res.send({ status: 200, data: { ...d, ...b, player_stats: playersLookup }, message: 'Game updated', notification_type: 'snack' });
};


// 
// 
// 
// 
// 
// get addPlayerGameStats to work similar to updatePlayerGameStats
// 
// 
// then need to add playergmae stats (both add and update) to season totals
// 
// 
// 

const addPlayerGameStats = async (req, res) => {
    const db = req.app.get('db');

    const { game_id, player_id } = req.params;

    console.log(req.params);
    console.log(req.body);

    const playerLookup = await db.players.findOne({ player_id });

    if (!playerLookup) {
        return res.send({ status: 404, data: [], message: 'Player does not exist' });
    }

    const { first_name, last_name } = playerLookup;
    // TODO: check player number for current season and add to game_player_stats insert
    // TODO: add game stats to player_season_stats as well

    const data = await db.game_player_stats.insert({ game_id, player_id, ...req.body });

    return res.send({ status: 200, data: { ...data, first_name, last_name }, message: 'Player stats added to game' });
};

const updatePlayerGameStats = async (req, res) => {
    const db = req.app.get('db');

    const { game_id, player_id } = req.params;
    const { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes } = req.body;

    console.log(req.params);
    console.log(req.body);

    const playerLookup = await db.players.findOne({ player_id });

    if (!playerLookup) {
        return res.send({ status: 404, data: [], message: 'Player does not exist' });
    }

    const { first_name, last_name } = playerLookup;
    // TODO: check player number for current season and add to game_player_stats insert
    // TODO: add game stats to player_season_stats as well

    // get game_player_stats table
    // check differences between old and new values
    // insert those differences into the game_team_stats table

    const bb = await db.game_player_stats.findOne({ player_id, game_id });

    console.log(bb, 'bbb')

    const diffShots = sog - bb.sog;
    const diffPims = penalties_in_minutes - bb.penalties_in_minutes;
    const diffGB = ground_balls - bb.ground_balls;

    console.log(diffPims, 'diffPimsdiffPimsdiffPims')
    // const diffGoals = goals - bb.goals;
    // const diffAssists = assists - bb.assists;
    // const diffInt = interceptions - bb.interceptions;
    // const diffTA = takeaways - bb.takeaways;
    // const diffUE = unforced_errors - bb.unforced_errors;
    // const diffPen = penalties - bb.penalties;
    // const diffFO = face_offs - bb.face_offs;


    // console.log({
    //     diffGoals, diffAssists, diffShots, diffGB, diffInt, diffTA, diffUE, diffPen, diffPims
    // });


    const data = await db.game_player_stats.update({ player_id, game_id }, { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes });


    // us_faceoffs_won: 0
    // us_goals_against: 0
    // us_goals_for: 7
    // us_ground_balls: 0
    // us_penalties_in_minutes: 0
    // us_shots: 0

    // get current game_team_stats


    const [updatedGame] = await db.game_team_stats.update({ game_id }, {
        $set: {
            us_shots: `us_shots + ${diffShots}`,
            us_ground_balls: `us_ground_balls + ${diffGB}`,
            us_penalties_in_minutes: `us_penalties_in_minutes + ${diffPims}`,
            // us_faceoffs_won: `us_faceoffs_won + ${diffFO}`
            // us_goals_against: `us_goals_against + `
            // us_goals_for: 7
        },
    });

    // console.log(databb, 'databbbbbbb')
    // console.log(data, 'datadatav')
    return res.send({ status: 200, data: { updatedGame, updatedPlayer: { ...data[0], first_name, last_name } }, message: 'Player stats added to game' });
};

const quickAddPlayersToGame = async (req, res) => {
    const db = req.app.get('db');
    const { game_id } = req.params;
    const { players } = req.body;

    console.log(game_id, 'game ID');
    console.log(players, 'player_ids');

    // const promises2 = [obj1, obj2].map(function(obj){
    //     return db.query('obj1.id').then(function(results){
    //         obj1.rows = results;
    //         return obj1;
    //     });
    // });

    await db.games.update({ game_id }, { has_been_played: true });

    const promises = players.map(async item => {
        await db.game_player_stats.insert({ game_id, player_id: item.player_id, player_number: item.player_number, season_id: CURRENT_SEASON });

        await db.player_season_stats.update({ player_id: item.player_id, season_id: CURRENT_SEASON }, {
            $set: {
                games_played: 'games_played + 1',
            },
        });
    });

    const results = await Promise.all(promises);
    console.log(results, 'restultsss')


    // await db.player_season_stats.update({ player_id, season_id: CURRENT_SEASON }, {
    //     $set: {
    //         games_played: 'games_played + 1',
    //     },
    // });

    return res.send({ status: 200, data: results, message: 'Players added to game' });
};

const removePlayerFromGameStats = async (req, res) => {
    const db = req.app.get('db');
    const { game_id, player_id } = req.params;
    const { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes } = req.body;

    // console.log({ game_id, player_id })
    // console.log(req.body, 'req bodyyyy')


    await db.game_team_stats.update({ game_id }, {
        $set: {
            us_shots: `us_shots - ${sog}`,
            us_ground_balls: `us_ground_balls - ${ground_balls}`,
            us_penalties_in_minutes: `us_penalties_in_minutes - ${penalties_in_minutes}`,
            // us_faceoffs_won: `us_faceoffs_won + ${diffFO}`
            // us_goals_against: `us_goals_against + `
        },
    });

    const [removedPlayer] = await db.game_player_stats.destroy({ player_id, game_id });

    const game = await _getGameById(db, game_id);

    if (game === false) {
        return res.send({ status: 404, data: [], message: 'Game does not exist' });
    }

    // return res.send({ status: 200, data, message: 'Retrieved game' });


    return res.send({ status: 200, data: { game, removedPlayer }, message: 'Player removed from game' });
};

module.exports = {
    getGames,
    createGame,
    getGameById,
    addPlayerGameStats,
    updatePlayerGameStats,
    quickAddPlayersToGame,
    updateGame,
    removePlayerFromGameStats,
};
