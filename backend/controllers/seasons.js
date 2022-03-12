const getSeasons = (req, res) => {
    const string = 'getting all DA seasons';
    return res.send(string);
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
    getSeasons,
    createSeason,
};
