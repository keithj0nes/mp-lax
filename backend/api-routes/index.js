const auth = require('./AUTH');
const seasons = require('./SEASONS');
const players = require('./PLAYERS');
const games = require('./GAMES');
const misc = require('./MISC');

const routesWithParentKeys = {
    seasons,
    auth,
    players,
    games,
    misc,
};

const allRoutes = Object.values(routesWithParentKeys).reduce((acc, curr) => ({ ...acc, ...curr }), {});

module.exports = allRoutes;

if (process.argv[2] === 'showTable') {
    if (process.argv[3]) {
        console.table(routesWithParentKeys[process.argv[3]]);
    } else {
        console.table(allRoutes);
    }
}
