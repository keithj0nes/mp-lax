// const app = require('../server');

// import { customAlphabet } from 'nanoid'
const { customAlphabet } = require('nanoid');
const { _getSeasons } = require('./seasons');

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
    const { selected_season } = req.query;
    const [currentSeason, allSeasons] = await _getSeasons(db);

    // if there is a selected_season, filter _getSeasons to make sure it exists
    // else, use the active season from _getSeasons [0]
    if (!!selected_season) {
        // console.log('here')
        const b = allSeasons.find(item => item.id === selected_season);
        // console.log(b, 'bb')

        if (!b) {
            return res.send({ status: 404, data: [], message: 'Season does not exist' });
        }
    }

    // const playersLookup = await db.players.find({}, { fields: ['player_id', 'first_name'] });
    const gamesLookup = await db.games.find({
        season_id: selected_season || currentSeason.id,
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

    // console.log(gamesLookup, 'gamesLookup');


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
    // TODO: update query to account for if season_id is passed from frontend
    const [currentSeason] = await _getSeasons(db);
    const gameId = customAlphabet('1234567890', 6)();

    const data = await db.games.insert({ game_id: parseInt(gameId), season_id: currentSeason.id, opponent, location, start_date, is_home });
    await db.game_team_stats.insert({ game_id: parseInt(gameId), season_id: currentSeason.id });
    return res.send({ status: 200, data, message: 'Game created' });
};

const updateGame = async (req, res) => {
    const db = req.app.get('db');

    const { game_id } = req.params;
    const {
        opponent,
        location,
        start_date,
        is_home,
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

    console.log(playersLookup, 'playersLookup update game');

    return res.send({ status: 200, data: { ...d, ...b, player_stats: playersLookup }, message: 'Game updated', notification_type: 'snack' });
};


const addPlayerGameStats = async (req, res) => {
    const db = req.app.get('db');

    const { game_id, player_id } = req.params;
    const { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes } = req.body;

    // TODO: update query to account for if season_id is passed from frontend
    const [currentSeason] = await _getSeasons(db);

    // console.log(req.params);
    // console.log(req.body);

    const playerLookup = await db.players.findOne({ player_id });

    if (!playerLookup) {
        return res.send({ status: 404, data: [], message: 'Player does not exist' });
    }

    const { first_name, last_name } = playerLookup;
    // TODO: check player number for current season and add to game_player_stats insert
    // TODO: add game stats to player_season_stats as well

    const data = await db.game_player_stats.insert({ game_id, player_id, ...req.body });


    const q = `
        UPDATE player_season_stats 
        SET games_played = games_played + 1,
            goals = goals + ${goals},
            assists = assists + ${assists},
            shots_on_goal = shots_on_goal + ${sog},
            take_aways = take_aways + ${takeaways},
            interceptions = interceptions + ${interceptions},
            unforced_errors = unforced_errors + ${unforced_errors},
            penalties_count = penalties_count + ${penalties},
            penalties_in_minutes = penalties_in_minutes + ${penalties_in_minutes},
            ground_balls = ground_balls + ${ground_balls},
            points = points + ${goals + assists}
        WHERE player_id = $1
        AND season_id = $2;
    `;

    const newSeasonStats = await db.query(q, [player_id, currentSeason.id]);

    // const newSeasonStats = await db.player_season_stats.update({ player_id, season_id: currentSeason.id }, {
    //     $set: {
    //         games_played: 'games_played + 1',
    //         goals: `goals + ${goals}`,
    //         assists: `assists + ${assists}`,
    //         shots_on_goal: `shots_on_goal + ${sog}`,
    //         take_aways: `take_aways + ${takeaways}`,
    //         interceptions: `interceptions + ${interceptions}`,
    //         unforced_errors: `unforced_errors + ${unforced_errors}`,
    //         penalties_count: `penalties_count + ${penalties}`,
    //         penalties_in_minutes: `penalties_in_minutes + ${penalties_in_minutes}`,
    //         ground_balls: `ground_balls + ${ground_balls}`,
    //         points: `points + ${goals + assists}`,
    //     },
    // });

    console.log({ newSeasonStats });

    // const [updatedGame] = await db.game_team_stats.update({ game_id }, {
    //     $set: {
    //         us_shots: `us_shots + ${sog}`,
    //         us_ground_balls: `us_ground_balls + ${ground_balls}`,
    //         us_penalties_in_minutes: `us_penalties_in_minutes + ${penalties_in_minutes}`,
    //         // us_faceoffs_won: `us_faceoffs_won + ${diffFO}`
    //         // us_goals_against: `us_goals_against + `
    //         // us_goals_for: 7
    //     },
    // });

    const q2 = `
        UPDATE game_team_stats 
        SET games_played = games_played + 1,
            us_shots = us_shots + ${sog},
            us_ground_balls = us_ground_balls + ${ground_balls},
            us_penalties_in_minutes = us_penalties_in_minutes + ${penalties_in_minutes}
        WHERE game_id = $1
        AND season_id = $2;
    `;

    const updatedGame = await db.query(q2, [game_id, currentSeason.id]);

    console.log(updatedGame,' updated game!!!')

    return res.send({ status: 200, data: { updatedGame, addedPlayer: { ...data, first_name, last_name } }, message: 'Player stats added to game' });
    // return res.send({ status: 200, data: { ...data, first_name, last_name }, message: 'Player stats added to game' });
};

const updatePlayerGameStats = async (req, res) => {
    const db = req.app.get('db');

    const { game_id, player_id } = req.params;
    const { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes } = req.body;

    // TODO: update query to account for if season_id is passed from frontend
    const [currentSeason] = await _getSeasons(db);

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

    // console.log(bb, 'bbb');

    const diffShots = sog - bb.sog;
    const diffPims = penalties_in_minutes - bb.penalties_in_minutes;
    const diffGB = ground_balls - bb.ground_balls;

    // console.log(diffPims, 'diffPimsdiffPimsdiffPims');
    const diffGoals = goals - bb.goals;
    const diffAssists = assists - bb.assists;
    const diffInt = interceptions - bb.interceptions;
    const diffTA = takeaways - bb.takeaways;
    const diffUE = unforced_errors - bb.unforced_errors;
    const diffPen = penalties - bb.penalties;
    // const diffFO = face_offs - bb.face_offs;


    // console.log({
    //     diffGoals, diffAssists, diffShots, diffGB, diffInt, diffTA, diffUE, diffPen, diffPims
    // });


    const data = await db.game_player_stats.update({ player_id, game_id }, { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes });


    const seasonStats = await db.player_season_stats.update({ player_id, season_id: currentSeason.id }, {
        $set: {
            goals: `goals + ${diffGoals}`,
            assists: `assists + ${diffAssists}`,
            shots_on_goal: `shots_on_goal + ${diffShots}`,
            take_aways: `take_aways + ${diffTA}`,
            interceptions: `interceptions + ${diffInt}`,
            unforced_errors: `unforced_errors + ${diffUE}`,
            penalties_count: `penalties_count + ${diffPen}`,
            penalties_in_minutes: `penalties_in_minutes + ${diffPims}`,
            ground_balls: `ground_balls + ${diffGB}`,
            points: `points + ${diffGoals + diffAssists}`,
        },
    });

    console.log({ seasonStats });


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
    // TODO: update query to account for if season_id is passed from frontend
    const [currentSeason] = await _getSeasons(db);

    await db.games.update({ game_id }, { has_been_played: true });
    console.log('RIGHT BEFORE: promises')

    const promises = players.map(async item => {
        await db.game_player_stats.insert({ game_id, player_id: item.player_id, player_number: item.player_number, season_id: currentSeason.id });


        const q = `
            UPDATE player_season_stats 
            SET games_played = games_played + 1
            WHERE player_id = $1
            AND season_id = $2;
        `;

        await db.query(q, [item.player_id, currentSeason.id]);


        // await db.player_season_stats.update({ player_id: item.player_id, season_id: currentSeason.id }, {
        //     $set: {
        //         games_played: 'games_played + 1',
        //     },
        // });
    });

    console.log(promises, 'promises')

    const results = await Promise.all(promises);
    console.log(results, 'restultsss');

    return res.send({ status: 200, data: results, message: 'Players added to game' });
};

const removePlayerFromGameStats = async (req, res) => {
    const db = req.app.get('db');
    const { game_id, player_id } = req.params;
    const { goals, assists, sog, ground_balls, interceptions, takeaways, unforced_errors, penalties, penalties_in_minutes } = req.body;

    // TODO: update query to account for if season_id is passed from frontend
    const [currentSeason] = await _getSeasons(db);

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

    await db.player_season_stats.update({ player_id, season_id: currentSeason.id }, {
        $set: {
            games_played: 'games_played - 1',
            goals: `goals - ${goals}`,
            assists: `assists - ${assists}`,
            shots_on_goal: `shots_on_goal - ${sog}`,
            take_aways: `take_aways - ${takeaways}`,
            interceptions: `interceptions - ${interceptions}`,
            unforced_errors: `unforced_errors - ${unforced_errors}`,
            penalties_count: `penalties_count - ${penalties}`,
            penalties_in_minutes: `penalties_in_minutes - ${penalties_in_minutes}`,
            ground_balls: `ground_balls - ${ground_balls}`,
            points: `points - ${goals + assists}`,
        },
    });

    const [removedPlayer] = await db.game_player_stats.destroy({ player_id, game_id });

    const game = await _getGameById(db, game_id);

    if (game === false) {
        return res.send({ status: 404, data: [], message: 'Game does not exist' });
    }

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
