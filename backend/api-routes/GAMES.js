const { getGames, getGameById, createGame, addPlayerGameStats, updatePlayerGameStats, quickAddPlayersToGame, updateGame, removePlayerFromGameStats } = require('../controllers/games');

const controller = (cb) => (process.argv[2] === 'showTable' ? cb.name : cb);

module.exports = {
    GET_GAMES: {
        method: 'GET',
        path: '/api/games',
        controller: controller(getGames),
        query: { selected_season: 'number' },
    },
    GET_GAME_BY_ID: {
        method: 'GET',
        path: '/api/games/:game_id',
        controller: controller(getGameById),
        // query: { page: 'number', dir: 'asc | desc' },
        params: { game_id: 'number' },
        body: { season_id: 'number' },
    },
    CREATE_GAME: {
        method: 'POST',
        path: '/api/games',
        controller: controller(createGame),
        body: { location: 'string', opponent: 'string', start_date: 'date', is_home: 'boolean' },
    },
    UPDATE_GAME: {
        method: 'PUT',
        path: '/api/games/:game_id',
        controller: controller(updateGame),
        params: { game_id: 'number' },
        // body: { location: 'string', opponent: 'string', start_date: 'date', is_home: 'boolean' },
    },
    ADD_PLAYER_GAME_STATS: {
        method: 'POST',
        path: '/api/games/:game_id/:player_id',
        controller: controller(addPlayerGameStats),
        params: { game_id: 'number', player_id: 'number' },
        // body: { opponent: 'string', start_date: 'date', is_home: 'boolean' },
    },
    UPDATE_PLAYER_GAME_STATS: {
        method: 'PUT',
        path: '/api/games/:game_id/:player_id',
        controller: controller(updatePlayerGameStats),
        params: { game_id: 'number', player_id: 'number' },
        // body: { opponent: 'string', start_date: 'date', is_home: 'boolean' },
    },
    QUICK_ADD_PLAYERS_TO_GAME: {
        method: 'PATCH',
        path: '/api/games/:game_id',
        controller: controller(quickAddPlayersToGame),
        params: { game_id: 'number' },
        body: { player_ids: 'array' },
    },
    REMOVE_PLAYER_FROM_GAME_STATS: {
        method: 'DELETE',
        path: '/api/games/:game_id/:player_id',
        controller: controller(removePlayerFromGameStats),
        params: { game_id: 'number', player_id: 'number' },
        // body: { opponent: 'string', start_date: 'date', is_home: 'boolean' },
    },
};
