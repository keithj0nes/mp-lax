const _getSeasons = async (db) => {
    const seasonsLookup = await db.seasons.find();

    // console.log(seasonsLookup, 'seasonsLookup')
    const activeSeason = seasonsLookup.find(item => !!item.is_active);
    // console.log(activeSeason, 'activeSeason')
    return [activeSeason, seasonsLookup];
};

const getSeasons = async (req, res) => {
    const db = req.app.get('db');
    // const seasonsLookup = await db.seasons.find();

    // console.log(seasonsLookup, 'seasonsLookup')
    // const activeSeason = seasonsLookup.find(item => !!item.is_active);

    const [activeSeason, allSeasons] = await _getSeasons(db);
    // console.log({ seasonsLookup: allSeasons, activeSeason })
    return res.send({ status: 200, data: { seasonsLookup: allSeasons, activeSeason }, message: 'Retrieved list of seasons' });
};

const createSeason = async (req, res) => {
    const db = req.app.get('db');
    const { name } = req.body;
    const seasonLookup = await db.seasons.findOne({ name });

    if (!!seasonLookup) {
        return res.send({ status: 400, data: [], message: 'Season already exists' });
    }

    const data = await db.seasons.insert({ name, created_at: new Date(), created_by: 1 });
    return res.send({ status: 200, data, message: 'Season created', notification_type: 'snack' });
};

module.exports = {
    _getSeasons,
    getSeasons,
    createSeason,
};
