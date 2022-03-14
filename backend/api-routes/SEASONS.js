const { getSeasons, createSeason } = require('../controllers/seasons');

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
        path: '/api/seasons/:id',
        params: { id: 'number' },
    },
    CREATE_SEASON: {
        method: 'POST',
        path: '/api/seasons',
        controller: controller(createSeason),
        body: { name: 'string' },
    },
};
