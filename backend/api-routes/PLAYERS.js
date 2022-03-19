const { getPlayers, createPlayer, getPlayerById, updatePlayer } = require('../controllers/players');

const controller = (cb) => (process.argv[2] === 'showTable' ? cb.name : cb);

module.exports = {
    GET_PLAYERS: {
        method: 'GET',
        path: '/api/players/',
        controller: controller(getPlayers),
        // query: { page: 'number', dir: 'asc | desc' },
    },
    GET_PLAYER_BY_ID: {
        method: 'GET',
        path: '/api/players/:player_id',
        controller: controller(getPlayerById),
        // query: { page: 'number', dir: 'asc | desc' },
        params: { player_id: 'number' },
        body: { season_id: 'number' },
    },
    CREATE_PLAYER: {
        method: 'POST',
        path: '/api/players',
        controller: controller(createPlayer),
        body: { first_name: 'string', last_name: 'string', graduation_year: 'number', player_number: 'number', add_to_current_season: 'boolean' },
    },
    UPDATE_PLAYER: {
        method: 'PUT',
        path: '/api/players/:player_id',
        controller: controller(updatePlayer),
        body: { first_name: 'string', last_name: 'string', graduation_year: 'number', player_number: 'number' },
    },
};
