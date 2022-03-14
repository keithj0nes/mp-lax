import React, { useState } from 'react';
import { Table, Title } from '../components';

const PLAYER = {
    first_name: 'Jerry',
    last_name: 'Smith',
    number: '17',
    positions: ['Attack', 'Middie'],

    career: {
        games_played: 28, goals: 49, goals_per_game: 0.1, assists: 21, assists_per_game: 0, points: 70, points_per_game: 0.1,
    },
    seasons: [
        { season_id: 1, name: '2020', games_played: 9, goals: 4, assists: 4, points: 8 },
        { season_id: 2, name: '2021', games_played: 14, goals: 29, assists: 10, points: 39 },
        { season_id: 3, name: '2022', games_played: 4, goals: 16, assists: 7, points: 23 },
        { season_id: null, name: 'Total', games_played: 28, goals: 49, assists: 21, points: 70 },
    ],
    current: [
        { game_id: 11, date: '2/10', opponent: 'Johns Creek', goals: 4, assists: 1, points: 5 },
        { game_id: 42, date: '2/13', opponent: 'Marietta', goals: 8, assists: 1, points: 9 },
        { game_id: 72, date: '2/20', opponent: 'Alpharetta', goals: 2, assists: 2, points: 4 },
        { game_id: 73, date: '2/29', opponent: 'Cumming', goals: 2, assists: 3, points: 5 },
    ],
};

const Player = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { first_name, last_name, number, positions, career } = PLAYER;


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
        { label: 'Date', alt: 'Date', default: true },
        { label: 'Game', className: 'whitespace-nowrap' },
        { label: 'G' },
        { label: 'A' },
        { label: 'PTS' },
    ];

    const currentSeasonColumns = {
        date: 'string',
        opponent: 'string',
        goals: 'number',
        assists: 'number',
        points: 'number',
    };


    return (
        <main className="py-6">

            <div className="bg-red-100 p-4 text-center rounded mb-4">
                Page under construction
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                >
                    Edit {first_name}
                </button>
            </div>

            {isEditing && (
                <>
                    <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                        <div className="sm:flex sm:gap-5">
                            <div className="mb-2 w-full">
                                <label htmlFor="first_name" className="text-sm text-gray-800">First Name</label>
                                <input value={first_name} type="text" name="first_name" id="first_name" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                <p className="pt-0.5 text-xs text-mpred transition duration-300 text-opacity-100">
                                    exmple of an error
                                    <span className="after:content-['.'] invisible" />
                                </p>
                                {/* <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.name}<span className="after:content-['.'] invisible"></span></p> */}
                            </div>

                            <div className="mb-2 w-full">
                                <label htmlFor="last_name" className="text-sm text-gray-800">Last Name</label>
                                <input value={last_name} type="text" name="last_name" id="last_name" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                            </div>
                        </div>

                        <div className="sm:flex sm:gap-5">
                            <div className="mb-2 w-full">
                                <label htmlFor="number" className="text-sm text-gray-800">Number</label>
                                <input value={number} type="number" name="number" id="number" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                            </div>

                            <div className="mb-2 w-full">
                                <label htmlFor="positions" className="text-sm text-gray-800">Positions - separate by comma</label>
                                <input value={positions} type="text" name="positions" id="positions" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">

                        <button
                            type="button"
                            onClick={() => setIsEditing(!isEditing)}
                            className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                        >
                            Save {first_name}
                        </button>
                    </div>
                </>

            )}

            {!isEditing && (
                <>
                    <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
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

                    </div>


                    <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Table
                            headers={currentSeasonHeaders}
                            columns={currentSeasonColumns}
                            body={PLAYER.current}
                            title="Current Season"
                            uniqueKey="game_id"
                        />
                    </div>

                    <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm">
                        <Table
                            headers={allSeasonsHeaders}
                            columns={allSeasonsColumns}
                            body={PLAYER.seasons}
                            title="All Seasons"
                            uniqueKey="season_id"
                        />
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

                    </div>
                </>
            )}
        </main>
    );
};

export default Player;
