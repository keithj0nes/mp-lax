/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import classNames from 'classnames';
import { EditPlayer, Table, Title } from '../components';
import { getPlayerById, clearPlayerByIdR } from '../redux/slices/playersSlice';
import { getGrade } from '../helpers';

// const PLAYER = {
//     first_name: 'Jerry',
//     last_name: 'Smith',
//     number: '17',
//     positions: ['Attack', 'Middie'],

//     career: {
//         games_played: 28, goals: 49, goals_per_game: 0.1, assists: 21, assists_per_game: 0, points: 70, points_per_game: 0.1,
//     },
//     seasons: [
//         { season_id: 1, name: '2020', games_played: 9, goals: 4, assists: 4, points: 8 },
//         { season_id: 2, name: '2021', games_played: 14, goals: 29, assists: 10, points: 39 },
//         { season_id: 3, name: '2022', games_played: 4, goals: 16, assists: 7, points: 23 },
//         { season_id: null, name: 'Total', games_played: 28, goals: 49, assists: 21, points: 70 },
//     ],
//     current: [
//         { game_id: 11, date: '2/10', opponent: 'Johns Creek', goals: 4, assists: 1, points: 5 },
//         { game_id: 42, date: '2/13', opponent: 'Marietta', goals: 8, assists: 1, points: 9 },
//         { game_id: 72, date: '2/20', opponent: 'Alpharetta', goals: 2, assists: 2, points: 4 },
//         { game_id: 73, date: '2/29', opponent: 'Cumming', goals: 2, assists: 3, points: 5 },
//     ],
// };

const Player = () => {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const params = useParams();
    const { player } = useSelector(state => state.players);

    useEffect(() => {
        dispatch(getPlayerById(params.player_id));
        return () => {
            dispatch(clearPlayerByIdR());
        };
    }, [dispatch, params.player_id]);

    const current = player.current?.map(item => ({
        ...item,
        // opponent: `${item.is_home ? 'vs' : '@'} ${item.opponent}`,
        // goal_differential: `${!item.has_been_played ? 'Not Yet Played' : item.goal_differential}`,
        // goal_differential: item.goal_differential > 0 ? `+${item.goal_differential}` : item.goal_differential,
        // start_date: dateFormat(item.start_date, 'MM/DD/YY')
        points: item.goals + item.assists,
        start_date: format(parseISO(item.start_date), 'M/dd/yy'),
    }));

    // console.log(current, 'current')


    const allSeasonsHeaders = [
        { label: 'Name', className: 'whitespace-nowrap', default: true },
        { label: 'GP', alt: 'Games Played' },
        { label: 'G' },
        { label: 'A' },
        { label: 'PTS' },
    ];

    const allSeasonsColumns = {
        name: 'string',
        games_played: 'number',
        goals: 'number',
        assists: 'number',
        points: 'number',
    };

    const currentSeasonHeaders = [
        { label: 'Date', alt: 'Date', className: 'w-0 pr-20', default: true },
        { label: 'Game', className: 'whitespace-nowrap' },
        { label: 'G' },
        { label: 'A' },
        { label: 'PTS' },
        { label: 'SHTS' },
        { label: 'GB' },
        { label: 'PIM' },
    ];

    // const currentSeasonColumns = {
    //     date: 'string',
    //     opponent: 'string',
    //     goals: 'number',
    //     assists: 'number',
    //     points: 'number',
    // };

    const currentSeasonColumns2 = {
        start_date: 'string',
        opponent: 'string',
        goals: 'number',
        assists: 'number',
        points: 'number',
        sog: 'number',
        ground_balls: 'number',
        penalties_in_minutes: 'number',
    };


    // figure out this issue with ttoalling!
    // may need to just make it a database call for ease

    const currentSeasonKeys = ['goals', 'assists', 'points', 'sog', 'ground_balls', 'penalties_in_minutes'];
    const allSeasonKeys = ['games_played', 'goals', 'assists', 'points'];

    const getTotals = (arr, keysToUse) => {
        if (!arr) return null;
        // console.log(arr, ' arrrr');
        const initialValue = keysToUse.reduce((a, v) => ({ ...a, [v]: 0 }), {});
        const totalsReduced = arr.reduce((acc, curr) => {
            const accCopy = { ...acc };
            for (const [key] of Object.entries(acc)) {
                accCopy[key] += curr[key];
            }
            return { ...acc, ...accCopy };
        }, initialValue);

        return totalsReduced;
    };

    // console.log(getTotals(current, currentSeasonKeys));
    // console.log(getTotals(player?.seasons, allSeasonKeys));

    return (
        <main className="py-6">

            {/* <div className="bg-red-100 p-4 text-center rounded mb-4">
                Page under construction
            </div> */}

            {/* <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                >
                    Edit {first_name}
                </button>
            </div> */}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    // className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                    className={classNames('transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue', {
                        'hidden': isEditing,
                    })}
                >
                    Edit {player.first_name}
                </button>

                {/* TODO: add 'did you you mean to save' modal if there's unsaved game state and back button is clicked */}

                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    // className="transition duration-300 text-mpblue py-1 px-3 mb-4 hover:text-mpblue hover:bg-transparent"
                    className={classNames('transition duration-300 text-mpblue py-1 px-3 mb-4 hover:text-mpblue hover:bg-transparent', {
                        'hidden': !isEditing,
                    })}
                >
                    Go Back
                </button>
            </div>

            {isEditing && <EditPlayer setIsEditing={setIsEditing} />}

            {!isEditing && (
                <>
                    {/* <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                        <h2 className="text-2xl font-bold">{first_name} {last_name}</h2>
                        <p className="text-sm">#{number} - {positions.map((pos, ind) => <span key={pos}>{pos} {ind + 1 !== positions.length && ' | '}</span>)}
                        </p>
                    </div>

                    <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold mr-4">{first_name} {last_name}</h2>
                            <p className="text-lg"> #{number}</p>
                        </div>

                        <div>
                            <p className="text-sm">
                                {positions.map((pos, ind) => <span key={pos}>{pos} {ind + 1 !== positions.length && ' | '}</span>)}
                            </p>
                            <p className="text-sm text-right">Senior</p>
                        </div>
                    </div> */}

                    <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold mr-4">{player.first_name} {player.last_name}</h2>
                            <p className="text-lg"> #{player.player_number}</p>
                        </div>

                        <div>
                            <p className="text-sm">
                                {/* {positions.map((pos, ind) => <span key={pos}>{pos} {ind + 1 !== positions.length && ' | '}</span>)} */}
                            </p>
                            <p className="text-sm text-right">{getGrade(player.graduation_year)?.label}</p>
                        </div>
                    </div>


                    <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Table
                            headers={currentSeasonHeaders}
                            columns={currentSeasonColumns2}
                            // body={current || []}
                            body={(current && [...current, { start_date: 'Total', ...getTotals(current, currentSeasonKeys) }]) || []}
                            title="Current Season NEW"
                            uniqueKey="game_id"
                        />
                    </div>

                    <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Table
                            headers={allSeasonsHeaders}
                            columns={allSeasonsColumns}
                            // body={player?.seasons || []}
                            // body={player?.seasons || []}
                            body={(player?.seasons && [...player.seasons, { name: 'Total', ...getTotals(player?.seasons, allSeasonKeys) }]) || []}
                            title="All Seasons NEW"
                            uniqueKey="season_id"
                        />
                    </div>


                    {/* <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Table
                            headers={currentSeasonHeaders}
                            columns={currentSeasonColumns}
                            body={PLAYER.current}
                            title="Current Season"
                            uniqueKey="game_id"
                        />
                    </div> */}

                    {/* <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Table
                            headers={allSeasonsHeaders}
                            columns={allSeasonsColumns}
                            body={PLAYER.seasons}
                            title="All Seasons"
                            uniqueKey="season_id"
                        />
                    </div> */}

                    {/* <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Title>Season Stats</Title>
                        <div className="flex flex-wrap">
                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Games Played</p>
                                <p className="text-3xl font-bold text-mpblue">{career.games_played}</p>
                            </div>

                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Goals</p>
                                <p className="text-3xl font-bold text-mpblue">{career.goals}</p>
                            </div>

                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Assists</p>
                                <p className="text-3xl font-bold text-mpblue">{career.assists}</p>
                            </div>

                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Points</p>
                                <p className="text-3xl font-bold text-mpblue">{career.points}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Title>Career Stats</Title>
                        <div className="flex flex-wrap">
                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Games Played</p>
                                <p className="text-3xl font-bold text-mpblue">{career.games_played}</p>
                            </div>

                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Goals</p>
                                <p className="text-3xl font-bold text-mpblue">{career.goals}</p>
                            </div>

                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Assists</p>
                                <p className="text-3xl font-bold text-mpblue">{career.assists}</p>
                            </div>

                            <div className="w-1/2 sm:w-auto sm:mr-10">
                                <p className="text-sm">Points</p>
                                <p className="text-3xl font-bold text-mpblue">{career.points}</p>
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </main>
    );
};

export default Player;
