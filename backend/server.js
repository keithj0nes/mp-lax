const express = require('express');
const massive = require('massive');
const cors = require('cors');
const path = require('path');
const api = require('./api-routes');

require('dotenv').config();

// const app = module.exports = express();
const app = express();
module.exports = app;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.method, '=>', req.url);
    next();
});


let connectionInfo;
if (process.env.NODE_ENV === 'production') {
    const dbUriSplit = process.env.DB_URI.split(/[:/@]+/);
    connectionInfo = {
        user: dbUriSplit[1],
        password: dbUriSplit[2],
        host: dbUriSplit[3],
        port: dbUriSplit[4],
        database: dbUriSplit[5],
        ssl: false,
        poolSize: 4,
    };
} else {
    connectionInfo = process.env.DB_URI;
}


massive(connectionInfo, { excludeMatViews: true, scripts: `${__dirname}/database/scripts` }).then(instance => {
    console.log('Database - connection established');
    app.set('db', instance); // add your connection to express
}).catch(err => console.log('Database - connection failed \n', err));

// ROUTES //

// Seasons
app.get(api.GET_SEASONS.path, api.GET_SEASONS.controller);
app.get(api.GET_SEASONS_BY_ID.path, (req, res) => {
    res.send(`Hello SEAONS by iddddd! ${req.params.season_id}`);
});

app.post(api.CREATE_SEASON.path, api.CREATE_SEASON.controller);
app.put(api.UPDATE_SEASON.path, api.UPDATE_SEASON.controller);


// Players
app.get(api.GET_PLAYERS.path, api.GET_PLAYERS.controller);
app.get(api.GET_ALL_PLAYERS.path, api.GET_ALL_PLAYERS.controller);
app.get(api.GET_PLAYER_BY_ID.path, api.GET_PLAYER_BY_ID.controller);
app.post(api.CREATE_PLAYER.path, api.CREATE_PLAYER.controller);
app.put(api.UPDATE_PLAYER.path, api.UPDATE_PLAYER.controller);

// MISC
app.get(api.GET_MISC.path, api.GET_MISC.controller);


// Games
app.get(api.GET_GAMES.path, api.GET_GAMES.controller);
app.get(api.GET_GAME_BY_ID.path, api.GET_GAME_BY_ID.controller);
app.post(api.CREATE_GAME.path, api.CREATE_GAME.controller);
app.post(api.ADD_PLAYER_GAME_STATS.path, api.ADD_PLAYER_GAME_STATS.controller);
app.put(api.UPDATE_PLAYER_GAME_STATS.path, api.UPDATE_PLAYER_GAME_STATS.controller);
app.patch(api.QUICK_ADD_PLAYERS_TO_GAME.path, api.QUICK_ADD_PLAYERS_TO_GAME.controller);
app.put(api.UPDATE_GAME.path, api.UPDATE_GAME.controller);
app.delete(api.REMOVE_PLAYER_FROM_GAME_STATS.path, api.REMOVE_PLAYER_FROM_GAME_STATS.controller);


// Used for production
if (process.env.NODE_ENV === 'production') {
    console.log('running in herooku');
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}!`);
});

// Seasons
// app.get('/api/seasons/',    seasons.getSeasons);
// app.get('/api/seasons/:id', seasons.getSeasonById);
