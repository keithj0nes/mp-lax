// TODO: change this to a variable season
const CURRENT_SEASON = 10001;

const getPlayers = async (req, res) => {
    const db = req.app.get('db');
    // const playersLookup = await db.players.find({}, { fields: ['player_id', 'first_name'] });
    // const playersLookup = await db.players.find();

    const query = `
        select * from players p
        join player_season_stats pss on pss.player_id = p.player_id
        join seasons s on s.id = pss.season_id
        where season_id = $1
    `;

    const playersLookup = await db.query(query, [CURRENT_SEASON]);

    // console.log(playersLookup, 'playersLookup');


    return res.send({ status: 200, data: playersLookup, message: 'Retrieved list of players' });
};

const createPlayer = async (req, res) => {
    const db = req.app.get('db');
    const { first_name, last_name, graduation_year, add_to_current_season } = req.body;

    if (!first_name || !last_name || !graduation_year) {
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
        playerSeasonStatsData = await db.player_season_stats.insert({ player_id: rnd, season_id: seasonLookup.id });
    }

    return res.send({ status: 200, data: add_to_current_season ? { ...data, ...playerSeasonStatsData } : [], message: 'Player created', notification_type: 'snack' });
};

module.exports = {
    getPlayers,
    createPlayer,
};
