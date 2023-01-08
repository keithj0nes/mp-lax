// TODO: change this to a variable season
// const CURRENT_SEASON = 10001;

const { _getSeasons } = require('./seasons');

const getPlayers = async (req, res) => {
    const db = req.app.get('db');
    // const playersLookup = await db.players.find({}, { fields: ['player_id', 'first_name'] });
    // const playersLookup = await db.players.find();

    // TODO: update query to account for if season_id is passed from frontend

    const [currentSeason] = await _getSeasons(db);

    // console.log(currentSeason, 'currentSeason')
    const query = `
        select * from players p
        join player_season_stats pss on pss.player_id = p.player_id
        join seasons s on s.id = pss.season_id
        where season_id = $1
    `;

    const playersLookup = await db.query(query, [currentSeason.id]);

    // console.log(playersLookup, 'playersLookup');


    return res.send({ status: 200, data: playersLookup, message: 'Retrieved list of players' });
};

const getAllPlayers = async (req, res) => {
    const db = req.app.get('db');

    const allPlayersLookup = await db.players.find({}, {
        order: [{
            field: 'graduation_year',
            direction: 'asc',
        }],
    });

    console.log(allPlayersLookup, 'allPlayersLookup')

    const q = `
        SELECT p.player_id AS player_id, p.first_name AS first_name,
            '[' || STRING_AGG('{ "name": "' || s.name || '", "id":' || s.id || 
            '}', ', ') || ']' AS seasons
        FROM players p
        LEFT JOIN player_season_stats pss ON pss.player_id = p.player_id
        LEFT JOIN seasons s ON s.id = pss.season_id
        GROUP BY p.player_id, p.first_name
        ORDER BY p.player_id;
    `;

    const newQuery = await db.query(q);

    console.log(newQuery, 'NEW AUERY!!')

    return res.send({ status: 200, data: allPlayersLookup, newQuery, message: 'Retrieved list of all players' });
};

const createPlayer = async (req, res) => {
    const db = req.app.get('db');
    const { first_name, last_name, graduation_year, player_number, add_to_current_season } = req.body;

    // if (!first_name || !last_name || !graduation_year) {
    if (!first_name || !last_name || !graduation_year || player_number < 0) {
        return res.send({ status: 400, data: [], message: 'need all fields' });
    }

    const playerLookup = await db.players.findOne({ first_name, last_name, graduation_year });

    if (!!playerLookup) {
        // TODO: set up a "did you mean..." list to show the front end
        return res.send({ status: 409, data: [], message: 'Player already exists' });
    }


    // TODO: set uet up random player id with nanoid - npm install
    const rnd = Math.floor(Math.random() * 1000);

    const data = await db.players.insert({ player_id: rnd, first_name, last_name, graduation_year, created_at: new Date(), created_by: 1 });

    let playerSeasonStatsData = {};
    if (add_to_current_season) {
        // find current season and add default stats
        const seasonLookup = await db.seasons.findOne({ is_active: true });
        playerSeasonStatsData = await db.player_season_stats.insert({ player_id: rnd, season_id: seasonLookup.id, player_number });
    }

    return res.send({ status: 200, data: add_to_current_season ? { ...data, ...playerSeasonStatsData } : [], message: 'Player created', notification_type: 'snack' });
};

const getPlayerById = async (req, res) => {
    const db = req.app.get('db');
    const { player_id } = req.params;
    // const { season_id } = req.body;
    const [currentSeason] = await _getSeasons(db);

    console.log(currentSeason, 'currentSeason')

    // get player details
    const playerLookup = await db.players.findOne(
        { player_id },
        {
            fields: ['player_id', 'first_name', 'last_name', 'graduation_year'],
        },
    );
    console.log(playerLookup, 'playerLookup');

    if (!playerLookup) {
        return res.send({ status: 404, data: [], message: 'Player does not exist' });
    }

    console.log(player_id, currentSeason.id, 'player_id, currentSeason.id')

    // get player games details for current season
    // const arr = ['*'];
    const arr = ['g.game_id', 'g.start_date', 'g.opponent', 'gps.goals', 'gps.assists', 'gps.sog', 'gps.ground_balls', 'gps.interceptions', 'gps.takeaways', 'gps.unforced_errors', 'gps.penalties', 'gps.penalties_in_minutes'];
    // const currentSeasonStatsQuery = `
    //     select ${arr.join(', ')} from game_player_stats gps
    //     join players p on p.player_id = gps.player_id
    //     join seasons s on s.id = gps.season_id
    //     join games g on g.game_id = gps.game_id
    //     where gps.player_id = $1 and gps.season_id = $2
    // `;
    const currentSeasonStatsQuery = `
        select g.game_id, g.start_date, t.name, gps.goals, gps.assists, gps.sog, gps.ground_balls, gps.interceptions, gps.takeaways, gps.unforced_errors, gps.penalties, gps.penalties_in_minutes from game_player_stats gps
        join players p on p.player_id = gps.player_id
        join seasons s on s.id = gps.season_id
        join games g on g.game_id = gps.game_id
        join teams t on t.id = g.opponent_id
        where gps.player_id = $1 and gps.season_id = $2
    `;
    const playerGamesLookup = await db.query(currentSeasonStatsQuery, [player_id, currentSeason.id]);


    // const playerGamesLookup = await db.game_player_stats.find({ player_id, season_id: currentSeason.id });

    console.log({ playerGamesLookup });


    // get player all seasons details
    const arr2 = ['pss.season_id', 's.name', 'pss.player_number', 'pss.games_played', 'pss.goals', 'pss.assists', 'pss.points', 'pss.penalties_count', 'pss.penalties_in_minutes', 'pss.game_winning_goals', 'pss.man_up_goals', 'pss.man_down_goals', 'pss.goals_per_game', 'pss.assists_per_game', 'pss.points_per_game', 'pss.shots', 'pss.shots_on_goal', 'pss.shooting_percentage', 'pss.ground_balls', 'pss.ground_balls_percentage', 'pss.interceptions', 'pss.take_aways', 'pss.unforced_errors'];
    const allSeasonsStatsQuery = `
        select ${arr2.join(', ')} from player_season_stats pss
        join players p on p.player_id = pss.player_id
        join seasons s on s.id = pss.season_id
        where pss.player_id = $1
        order by pss.season_id;
    `;
    const playerSeasonsLookup = await db.query(allSeasonsStatsQuery, [player_id]);

    return res.send({ status: 200, data: { ...playerLookup, player_number: playerSeasonsLookup[playerSeasonsLookup.length - 1].player_number, current: playerGamesLookup, seasons: playerSeasonsLookup }, message: 'Retrieved game' });
};


const updatePlayer = async (req, res) => {
    const db = req.app.get('db');
    const { player_id } = req.params;
    const { first_name, last_name, graduation_year, player_number } = req.body;
    const [currentSeason] = await _getSeasons(db);

    // console.log({ first_name, last_name, graduation_year, player_number },' boddyy')

    if (!first_name || !last_name || !graduation_year || player_number < 0) {
        return res.send({ status: 400, data: [], message: 'need all fields' });
    }

    const playerLookup = await db.players.findOne({ player_id });

    if (!playerLookup) {
        return res.send({ status: 409, data: [], message: 'Player does not exist' });
    }
    await db.players.update({ player_id }, { first_name, last_name, graduation_year });
    await db.player_season_stats.update({ player_id, season_id: currentSeason.id }, { player_number });
    return res.send({ status: 200, data: { first_name, last_name, graduation_year, player_number }, message: 'Updated player details' });
};


module.exports = {
    getPlayers,
    getAllPlayers,
    createPlayer,
    getPlayerById,
    updatePlayer,
};
