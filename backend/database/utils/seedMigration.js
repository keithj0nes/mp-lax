/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
const massive = require('massive');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { add } = require('date-fns');
const { customAlphabet } = require('nanoid');
const path = require('path');
const { selectEnvironment } = require('./selectEnvironment');
const { wait, randomr, getRandomItemsFromArray } = require('./seedHelpers');


// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsPath = path.join(__dirname, '..', 'scripts');
const nanoid = customAlphabet('1234567890ABCDEFGHJK', 8);
const numNanoid = customAlphabet('1234567890', 8);
const argv = process.argv.slice(2);
const connectionInfo = selectEnvironment(argv[1]);
const todaysDate = new Date();


const dropTables = async () => massive(connectionInfo, { excludeMatViews: true, scripts: scriptsPath }).then(async (db) => {
    console.log('\n\nDropping tables');
    console.log('---------------');

    const tableCount = (await db.listTables()).length;
    console.log(tableCount, 'table count');
    await db.drop_tables();

    await wait(1000);

    console.log(` ✅ ${tableCount} tables removed`);
    console.log('--------------------');
    console.log('Drop tables complete\n');
    db.instance.$pool.end();
    return true;
});


const seedTables = async () => massive(connectionInfo, { excludeMatViews: true }).then(async (db) => {
    console.log('\nInitializing seeding');
    console.log('--------------------');

    // hard variables
    const typesOfSeasons = ['Regular', 'Playoffs', 'Tournament'];
    // const seasonsList = ['Summer 2020', 'Fall 2021', 'Summer 2021'];
    const seasonsList = ['2020', '2021', '2022', '2023'];
    const divisionList = ['1A', '2B', '3C', '4D'];
    const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena', 'Center Ice Arena', 'The Cooler', 'The Igloo', 'The Coliseum'];
    const counts = {
        teams: { min: 20, max: 30, exact: null }, // teams per division - exact has priority
        games: { min: 5, max: 8, exact: null }, // games per team - exact has priority
        players: { min: 9, max: 16, exact: null }, // players per team - exact has priority
        totalPlayers: 200,
    };
    const users = [
        { email: 'admin@mplax.com', role_id: 1 },
        // { email: 'admin@hockeydb.com', role_id: 2 },
        // { email: 'scorekeeper@hockeydb.com', role_id: 3 }, // not doing anything with this role yet
        // { email: 'teammanager@hockeydb.com', role_id: 4 }, // not doing anything with this role yet
        // { email: 'multiaccounts@hockeydb.com', role_id: 5 },
    ];
    const newsPosts = [
        { title: 'Registrations Open Soon', display_order: 1, body: '<p>Signups start May 1st. Look for the registration link emails to be sent out soon</p>' },
        { title: 'Welcome to our league', display_order: 2, body: '<p>As we look to work out some of the kinks of a new league, we\'re looking to add some new features in the near future.</p><p><br></p><p><strong><em>Features that include:</em></strong></p><ul><li>Registrations</li><li>Player Stats</li><li>Payments</li><li>Email Notifications</li><li>Messaging</li><li>Native Phone App</li></ul><p><br></p><p>All with a fun, friendly, and easy to use user interface (UI).</p>' },
    ];

    // create users
    const createUsers = async () => Promise.all(users.map(async user => {
        const password = process.env.TESTING_PASSWORD;
        const hash = await bcrypt.hash(password, 10);
        const insertedUser = await db.users.insert({ first_name: faker.name.firstName(), last_name: faker.name.lastName(), email: user.email, password: hash, created_at: todaysDate });
        // await db.user_role.insert({ user_id: insertedUser.id, role_id: user.role_id });
        return insertedUser;
    }));

    // create seasons
    const createSeason = async ({ admin }) => {
        const results = [];
        // RUN ARRAY OF PROMISES SEQUENTIALLY
        for (const [idx, season] of seasonsList.entries()) {
            const isLastSeasonInList = (idx + 1) === seasonsList.length;

            results.push(
                await db.seasons.insert({ name: season, is_active: !!isLastSeasonInList, created_at: todaysDate, created_by: admin.id }),
            );

            if (!isLastSeasonInList) {
                results.push(
                    await db.seasons.insert({ name: `${season} Playoffs`, created_at: todaysDate, created_by: admin.id }),
                );
            }
        }
        return results;
    };

    // const createSeason2 = async ({ admin }) => Promise.all(seasonsList.map(async (seedSeason, idx) => {
    //     // const type = typesOfSeasons[randomr(typesOfSeasons.length)];
    //     const isLastSeasonInList = (idx + 1) === seasonsList.length;
    //     // const insertedSeason = await db.seasons.insert({ name: seedSeason, type, is_active: !!isLastSeasonInList, created_at: todaysDate, start_date: add(todaysDate, { months: idx * 2 }), created_by: admin.id });
    //     // return insertedSeason;

    //     await db.seasons.insert({ name: seedSeason, is_active: !!isLastSeasonInList, created_at: todaysDate, created_by: admin.id });

    //     if (!isLastSeasonInList) {
    //         await db.seasons.insert({ name: `${seedSeason} Playoffs`, created_at: todaysDate, created_by: admin.id });
    //     }

    //     return true;
    // }));

    // create divisions
    // const createDivisions = async ({ admin }) => Promise.all(divisionList.map(async division => {
    //     const insertedDivision = await db.divisions.insert({ name: division, created_at: todaysDate, created_by: admin.id });
    //     return insertedDivision;
    // }));


    // create teams
    // const createTeams = async ({ admin }) => Promise.all(Array(counts.teams.exact).fill().map(async () => {
    //     const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
    //     const name = `${faker.address.city()} ${teamList[randomr(teamList.length)]}s`;
    //     const colors = colorRandomizer();
    //     const insertedTeam = await db.teams.insert({ name, colors, created_at: todaysDate, created_by: admin.id });
    //     return insertedTeam;
    // }));

    // create locations
    // const createLocations = async ({ admin }) => Promise.all(locationsList.map(async location => {
    //     const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;
    //     const createdLocation = await db.locations.insert({ name: location, address, created_at: todaysDate, created_by: admin.id });
    //     return createdLocation;
    // }));

    const createTeams = async ({ admin }) => {
        const TOTAL_TEAMS = 10;
        return Promise.all(Array(TOTAL_TEAMS).fill().map(async () => {
            const name = `${faker.address.city()} HS`;
            const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;

            const insertedTeam = await db.teams.insert({ name, created_at: todaysDate, created_by: admin.id });
            const insertedLocation = await db.locations.insert({ name, address, created_at: todaysDate, created_by: admin.id });

            const insertedTeamLocation = await db.team_location.insert({ team_id: insertedTeam.id, location_id: insertedLocation.id });

            return insertedTeamLocation;
        }));
    };

    // create players
    const createPlayers = async ({ admin, activeSeason }) => {
        const TOTAL_PLAYERS = 18;
        // const activeSeason = seasons.find(season => !!season.is_active);

        const players = Promise.all(Array(TOTAL_PLAYERS).fill().map(async () => {
            const first_name = faker.name.firstName('male');
            const last_name = faker.name.lastName();
            const currentSeasonYear = randomr(parseInt(activeSeason.name), parseInt(activeSeason.name) + 4);
            const inserted = await db.players.insert({ player_id: nanoid(), first_name, last_name, graduation_year: currentSeasonYear, created_at: todaysDate, created_by: admin.id });
            return inserted;
        }));

        return players;
    };

    // associate teams to seasons and divisions

    const createGames = async ({ admin, activeSeason }) => {
        const TOTAL_PLAYED_GAMES = 8;
        const TOTAL_UNPLAYED_GAMES = 3;
        const TOTAL_PLAYERS_TO_PLAYED_GAME = 10;

        const teamsLocations = await db.team_location.find();
        const players = await db.players.find();
        // TODO: add player stats in the game
        // const activeSeason = seasons.find(season => !!season.is_active);

        await Promise.all(Array(TOTAL_PLAYED_GAMES).fill().map(async () => {
            const opponent = teamsLocations[randomr(teamsLocations.length)];
            const goals_for = randomr(0, 15);
            const goals_against = randomr(0, 15);
            const goal_differential = Math.abs(goals_for - goals_against);
            // eslint-disable-next-line no-nested-ternary
            const result = goals_for === goals_against ? 'T' : goals_for > goals_against ? 'W' : 'L';
            const is_home = !!randomr(0, 1);
            // game_id: numNanoid(),

            const insertedGame = await db.games.insert({ season_id: activeSeason.id, opponent_id: opponent.team_id, location_id: is_home ? 1 : opponent.location_id, result, is_home, has_been_played: true, goals_for, goals_against, goal_differential, created_at: todaysDate, created_by: admin.id });

            const rndmPlayers = getRandomItemsFromArray(players, TOTAL_PLAYERS_TO_PLAYED_GAME);

            let goals_for_copy = goals_for;

            await db.game_team_stats.insert({ game_id: insertedGame.game_id, us_goals_for: goals_for, opponent_goals_against: goals_for, us_goals_against: goals_against, opponent_goals_for: goals_against });

            await Promise.all(rndmPlayers.map(async (player) => {
                goals_for_copy -= randomr(0, goals_for_copy);
                await db.game_player_stats.insert({ game_id: insertedGame.game_id, season_id: activeSeason.id, player_id: player.player_id, player_number: randomr(1, 99), goals: goals_for_copy, assists: randomr(0, 8) })
            }));
        }));

        await Promise.all(Array(TOTAL_UNPLAYED_GAMES).fill().map(async () => {
            const opponent = teamsLocations[randomr(teamsLocations.length)];
            const is_home = !!randomr(0, 1);

            await db.games.insert({ season_id: activeSeason.id, opponent_id: opponent.team_id, location_id: is_home ? 1 : opponent.location_id, is_home, created_at: todaysDate, created_by: admin.id });
        }));
    };

    const associatePlayerToSeason = async ({ activeSeason }) => {
        const TOTAL_PLAYERS_TO_CURRENT_SEASON = 10;
        const players = await db.players.find();
        const rndmPlayers = getRandomItemsFromArray(players, TOTAL_PLAYERS_TO_CURRENT_SEASON);

        await Promise.all(rndmPlayers.map(async (player) => {
            await db.player_season_stats.insert({ player_id: player.player_id, season_id: activeSeason.id })
        }));
    };


    // const createGames2 = async ({ admin }) => {
    //     const locations = await db.locations.find();
    //     const createdDivisions = await db.divisions.find();
    //     const createdSeasons = await db.seasons.find();

    //     // create games for one division
    //     // teams must be in division
    //     // teams cannot play itself

    //     return Promise.all(createdSeasons.map(season => Promise.all(createdDivisions.map(async division => {
    //         // const { exact, min, max } = counts.games;
    //         const seasonGamesLength = 12; // exact || randomr(min, max);
    //         const divisionTeams = await db.team_season_division.find({ division_id: division.id, season_id: 1 });

    //         return Promise.all(Array(seasonGamesLength).fill().map(async () => {
    //             let home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
    //             let away_team = divisionTeams[randomr(divisionTeams.length)].team_id;

    //             const location_id = randomr(locations.length) + 1;
    //             const start_date = season.is_active ? faker.date.future() : faker.date.past();

    //             // team cannot play itself
    //             while (home_team === away_team) {
    //                 home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
    //                 away_team = divisionTeams[randomr(divisionTeams.length)].team_id;
    //             }

    //             const gameStats = {
    //                 home_first_score: season.is_active ? 0 : randomr(5),
    //                 home_second_score: season.is_active ? 0 : randomr(5),
    //                 home_third_score: season.is_active ? 0 : randomr(3),
    //                 home_first_sog: season.is_active ? 0 : randomr(13),
    //                 home_second_sog: season.is_active ? 0 : randomr(10),
    //                 home_third_sog: season.is_active ? 0 : randomr(10),
    //                 // home_first_pim: randomr(2),
    //                 // home_second_pim: randomr(2),
    //                 // home_third_pim: randomr(2),
    //                 away_first_score: season.is_active ? 0 : randomr(5),
    //                 away_second_score: season.is_active ? 0 : randomr(5),
    //                 away_third_score: season.is_active ? 0 : randomr(3),
    //                 away_first_sog: season.is_active ? 0 : randomr(13),
    //                 away_second_sog: season.is_active ? 0 : randomr(10),
    //                 away_third_sog: season.is_active ? 0 : randomr(10),
    //                 // away_first_pim: randomr(2),
    //                 // away_second_pim: randomr(2),
    //                 // away_third_pim: randomr(2),
    //             };

    //             const home_score = (gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score);
    //             const away_score = (gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score);

    //             const game = await db.games.insert({ home_team, away_team, has_been_played: !season.is_active, created_by: admin.id, location_id, start_date, home_score, away_score, ...gameStats });
    //             await db.game_season_division.insert({ game_id: game.id, season_id: season.id, division_id: division.id });

    //             // set team_season_division stats here

    //             if (!season.is_active) {
    //                 let home_points = 0;
    //                 let away_points = 0;
    //                 if (home_score > away_score) {
    //                     home_points = 2;
    //                 } else if (away_score > home_score) {
    //                     away_points = 2;
    //                 } else if (home_score === away_score) {
    //                     home_points = 1;
    //                     away_points = 1;
    //                 }

    //                 const home_stats = {
    //                     games_played: 'games_played + 1',
    //                     wins: `wins + ${home_score > away_score ? 1 : 0}`,
    //                     losses: `losses + ${home_score < away_score ? 1 : 0}`,
    //                     ties: `ties + ${home_score === away_score ? 1 : 0}`,
    //                     points: `points + ${home_points}`,
    //                     goals_for: `goals_for + ${gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score}`,
    //                     goals_against: `goals_against + ${gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score}`,
    //                     penalties_in_minutes: `penalties_in_minutes + ${0}`,

    //                     // games_played: home.games_played + 1,
    //                     // wins: home.wins + (home_score > away_score ? 1 : 0),
    //                     // losses: home.losses + (home_score < away_score ? 1 : 0),
    //                     // ties: home.ties + (home_score === away_score ? 1 : 0),
    //                     // points: home.points + home_points,
    //                     // goals_for: home.goals_for + (gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score),
    //                     // goals_against: home.goals_against + (gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score),
    //                     // penalties_in_minutes: home.penalties_in_minutes + 0,
    //                 };

    //                 const away_stats = {
    //                     games_played: 'games_played + 1',
    //                     wins: `wins + ${away_score > home_score ? 1 : 0}`,
    //                     losses: `losses + ${away_score < home_score ? 1 : 0}`,
    //                     ties: `ties + ${away_score === home_score ? 1 : 0}`,
    //                     points: `points + ${away_points}`,
    //                     goals_for: `goals_for + ${gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score}`,
    //                     goals_against: `goals_against + ${gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score}`,
    //                     penalties_in_minutes: `penalties_in_minutes + ${0}`,
    //                 };

    //                 // console.log({ home_stats, away_stats })
    //                 // update home_team stats
    //                 await db.team_season_division.update({ team_id: home_team, season_id: season.id, division_id: division.id }, {
    //                     $set: { ...home_stats },
    //                 });

    //                 // update away_team stats
    //                 await db.team_season_division.update({ team_id: away_team, season_id: season.id, division_id: division.id }, {
    //                     $set: { ...away_stats },
    //                 });
    //             }
    //         }));
    //     }))));
    // };


    // create locations
    // const createLocations = async ({ admin }) => Promise.all(locationsList.map(async location => {
    const createHomeLocation = async ({ admin }) => {
        const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;
        const createdLocation = await db.locations.insert({ name: 'Pisgah HS', address, created_at: todaysDate, created_by: admin.id });
        return createdLocation;
    };


    const initiateSeed = async () => {
        const createdUsers = await createUsers();
        console.log(' ✅ Users Created');

        await createHomeLocation({ admin: createdUsers[0] });
        console.log(' ✅ Home Location Created');

        // await createDivisions({ admin: createdUsers[0] });
        // console.log(' ✅ Divisions Created');


        const seasons = await createSeason({ admin: createdUsers[0] });
        console.log(' ✅ Seasons Created');

        const activeSeason = seasons.find(season => !!season.is_active);


        await createTeams({ admin: createdUsers[0] });
        console.log(' ✅ Teams Created');

        await createPlayers({ admin: createdUsers[0], activeSeason });
        console.log(' ✅ Players Created');

        await createGames({ admin: createdUsers[0], activeSeason });
        console.log(' ✅ Games Created');

        await associatePlayerToSeason({ activeSeason });
        console.log(' ✅ Players Seasons Associated');


        
        // await associateTeamsToSeasonsDivisions();
        // console.log(' ✅ Teams Seasons Divisions Associated');
        
        // await associatePlayersToTeamsSeasons();
        // console.log(' ✅ Players Teams Seasons Associated');


        // // need to loop over each team and make sure there are no dupilicate numbers on the same team
        // // await associateNumbersToPlayersPerSeason();
        // // console.log('   ✅   Player Numbers Associated');

        // await createGames({ admin: createdUsers[0] });
        // console.log(' ✅ Games Created');

        // await setActiveSeasonGamesPlayed({ admin: createdUsers[0] });
        // console.log(' ✅ Current Season\' Games Updated');

        // await createNews({ admin: createdUsers[0] });
        // console.log(' ✅ News Created');

        // await createRegistrationTemplates({ admin: createdUsers[0] });
        // console.log(' ✅ Registration Templates Created');

        // await createPlayerRegistrations(createdUsers);
        // console.log(' ✅ Player Registrations Created');

        console.log('--------------------');
        console.log('Seeding complete \n \n');

        db.instance.$pool.end();
        return true;
    };


    return initiateSeed();
    // console.log('disconnecting from massive [seedTables]')
}).catch(err => {
    console.log(err, 'massive error in npm run seed');
});

module.exports = {
    dropTables,
    seedTables,
};
