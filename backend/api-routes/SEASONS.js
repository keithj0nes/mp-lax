const { getSeasons, createSeason, updateSeason } = require('../controllers/seasons');

const controller = (cb) => (process.argv[2] === 'showTable' ? cb.name : cb);

module.exports = {
    GET_SEASONS: {
        method: 'GET',
        path: '/api/seasons/',
        controller: controller(getSeasons),
        // query: { page: 'number', dir: 'asc | desc' },
    },
    GET_SEASONS_BY_ID: {
        method: 'GET',
        path: '/api/seasons/:season_id',
        params: { id: 'number' },
    },
    CREATE_SEASON: {
        method: 'POST',
        path: '/api/seasons',
        controller: controller(createSeason),
        body: { name: 'string' },
    },
    UPDATE_SEASON: {
        method: 'PUT',
        path: '/api/seasons/:season_id',
        controller: controller(updateSeason),
        body: { name: 'string', is_active: 'boolean' },
    },
};
