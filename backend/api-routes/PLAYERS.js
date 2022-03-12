const { getPlayers, createPlayer } = require('../controllers/players');

const controller = (cb) => (process.argv[2] === 'showTable' ? cb.name : cb);

module.exports = {
    GET_PLAYERS: {
        method: 'GET',
        path: '/api/players/',
        controller: controller(getPlayers),
        // query: { page: 'number', dir: 'asc | desc' },
    },
    CREATE_PLAYER: {
        method: 'POST',
        path: '/api/players',
        controller: controller(createPlayer),
        body: { first_name: 'string', last_name: 'string', graduation_year: 'number', add_to_current_season: 'boolean' },
    },
};
