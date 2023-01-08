const getAllMisc = async (req, res) => {
    const db = req.app.get('db');

    const teams = await db.teams.find();
    const locations = await db.locations.find();
    const orgs = await db.orgs.find();

    return res.send({ status: 200, data: { teams, locations, orgs }, message: 'Retrieved misc' });
};

module.exports = {
    getAllMisc,
};
