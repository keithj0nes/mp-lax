const _getSeasons = async (db) => {
    const seasonsLookup = await db.seasons.find({}, {
        order: [{
            field: 'id',
            direction: 'asc',
        }],
    });

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

const updateSeason = async (req, res) => {
    const db = req.app.get('db');
    const { season_id } = req.params;
    const { name, is_active } = req.body;

    const seasonLookup = await db.seasons.findOne({ id: season_id });

    if (!seasonLookup) {
        return res.send({ status: 404, data: [], message: 'Season does not exist' });
    }

    let updatedSeason;
    if (!!is_active) {
        await db.seasons.update({ is_active: true }, { is_active: false });
        updatedSeason = await db.seasons.update({ id: season_id }, { name, is_active });
    } else {
        updatedSeason = await db.seasons.update({ id: season_id }, { name });
    }

    return res.send({ status: 200, data: updatedSeason[0], message: 'Season updated', notification_type: 'snack' });
};

module.exports = {
    _getSeasons,
    getSeasons,
    createSeason,
    updateSeason,
};
