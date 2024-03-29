import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import { getGameById, clearGameByIdR } from '../redux/slices/gamesSlice';
import { Table, Title, Loader, QuickAddPlayersToGame, EditGame } from '../components';
import { MyModal } from '../components/Modal';

const GAME = {
    opponent: 'Alpharetta HS',
    opponent_id: 2432,
    location: '1234 10th st, Alpharetta',
    date: 'February 18th, 2022',
    has_been_played: false,
    scores: {
        us: [2, 4, 3, 7, 16],
        opponent: [2, 2, 5, 2, 11],
    },
    team_stats: {
        goals: { us: 16, opponent: 11 },
        ground_balls: { us: 10, opponent: 16 },
        shots: { us: 24, opponent: 22 },
        faceoffs_won: { us: 20, opponent: 11 },
        penalties_in_minutes: { us: 2.5, opponent: 5 },
    },
    // player_stats: [
    //     { id: 1, first_name: 'John', last_name: 'Hicks', number: 22, graduation_year: 2024, goals: 3, assists: 1, points: 4 },
    //     { id: 2, first_name: 'Aiden', last_name: 'Carlock', number: 24, graduation_year: 2024, goals: 3, assists: 2, points: 5 },
    //     { id: 3, first_name: 'Jack', last_name: 'Cendoya', number: 55, graduation_year: 2022, goals: 1, assists: 0, points: 1 },
    // ],
    // player_stats2: {
    //     245335: { first_name: 'John', last_name: 'Hicks', number: 22, graduation_year: 2024, goals: 3, assists: 1, points: 4 },
    //     259924: { first_name: 'Aiden', last_name: 'Carlock', number: 24, graduation_year: 2024, goals: 3, assists: 2, points: 5 },
    //     385300: { first_name: 'Jack', last_name: 'Cendoya', number: 55, graduation_year: 2022, goals: 1, assists: 0, points: 1 },
    // },
    goalie_stats: [
        { id: 12, first_name: 'Matthew', last_name: 'Davidson', player_number: 5, graduation_year: 2022, minutes: 48, shots_on_goal: 22, saves: 11, save_percentage: 0.5, goals_against: 11, goals_against_percentage: 0.5 },
        // { id: 24, first_name: 'Aiden', last_name: 'Carlock', number: 24, graduation_year: 2024, goals: 3, assists: 2, points: 5 },
    ],
};


// save percentage calc = saves / shots on goal
const Game = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const params = useParams();

    const { game, singleGameLoading } = useSelector(state => ({ ...state.games, ...state.players }));

    // console.log(game, ' SINGGLE GAMEE =====');

    // console.log(singleGameLoading, 'singleGameLoading')

    useEffect(() => {
        dispatch(getGameById(params.game_id));

        return () => {
            dispatch(clearGameByIdR());
        };
    }, [dispatch, params.game_id]);

    const goalie_stats = GAME.goalie_stats.map(item => ({ ...item, name: `${item.first_name} ${item.last_name}` }));

    const { has_been_played, opponent_name, location_name, start_date, player_stats } = game;
    const usScores = Object.keys(game).filter(ele => ele.startsWith('us_') && ele.includes('_scores_') && !ele.includes('_scores_overtime'));
    const opponentScores = Object.keys(game).filter(ele => ele.startsWith('opponent_') && ele.includes('_scores_') && !ele.includes('_scores_overtime'));

    const playerHeaders = [
        { label: '#', sort: 'player_number', className: 'whitespace-nowrap w-0', default: true },
        { label: 'Player', sort: 'last_name', className: 'whitespace-nowrap' },
        { label: 'G', sort: 'goals' },
        { label: 'A', sort: 'assists' },
        { label: 'PTS' }, // TODO: took sort by points off until fix error (below)
        { label: 'Shts', sort: 'sog' },
        { label: 'Shts%' }, // TODO: took sort by sog_percent off until fix error (below)
        { label: 'GB', sort: 'ground_balls' },
        { label: 'PIMs', sort: 'penalties_in_minutes' },
        // { label: 'PTS', sort: 'points' },
    ];

    const playerColumns = {
        player_number: 'number',
        name: {
            type: 'link',
            format: '/players/$player_id',
            as: '$first_name $last_name',
            className: 'whitespace-nowrap',
        },
        goals: 'number',
        assists: 'number',
        // points: 'number',
        // might want to change this and have it look through ad add a "points" key to the game object
        // currenty if sorting by points, will error out
        points: {
            type: 'math',
            format: '$goals + $assists',
        },
        sog: 'number',
        sog_percent: {
            type: 'math',
            format: '$goals / $sog * 100',
            fixed: '1',
        },
        ground_balls: 'number',
        penalties_in_minutes: 'number',
    };

    const goalieHeaders = [
        { label: '#', className: 'whitespace-nowrap w-0', default: true },
        { label: 'Player', className: 'whitespace-nowrap' },
        { label: 'SOG' },
        { label: 'SV' },
        { label: 'SV%' },
        { label: 'GA' },
        { label: 'GA%' },
        { label: 'Min' },
    ];

    const goalieColumns = {
        player_number: 'number',
        name: 'string',
        // name: {
        //     type: 'link',
        //     format: '/players/$id',
        //     as: '$first_name $last_name',
        //     className: 'whitespace-nowrap',
        // },
        shots_on_goal: 'number',
        saves: 'number',
        save_percentage: 'number',
        goals_against: 'number',
        goals_against_percentage: 'number',
        minutes: 'number',
    };

    const renderWhenEditing = () => {
        if (isEditing && !player_stats?.length) {
            return <QuickAddPlayersToGame setIsEditing={setIsEditing} isEditing={isEditing} />;
        }
        if (isEditing && game.has_been_played) {
            return <EditGame setIsEditing={setIsEditing} isEditing={isEditing} playerColumns={playerColumns} playerHeaders={playerHeaders} />;
        }
        return null;
    };

    return (
        <main className="single-game-container py-6">
            <Helmet>
                <title>{`MP Boys Lax | VS ${opponent_name}`}</title>
            </Helmet>
            <Loader loading={singleGameLoading} />

            <MyModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="max-w-md w-full">
                    <div className="p-4">
                        Exporting Game
                        <div className="flex justify-center">
                            <Loader loading fullScreen={false} />
                        </div>
                    </div>
                </div>
            </MyModal>

            <div className="flex justify-between items-center mb-4">

                <button type="button" className="flex items-center text-mpblue" onClick={() => setIsOpen(true)}>
                    <svg className="w-6 h-6 mr-2 text-mpblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Game
                </button>


                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    // className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                    className={classNames('transition duration-300 border border-mpblue text-mpblue py-1 px-3 hover:text-white hover:bg-mpblue', {
                        'hidden': isEditing,
                    })}
                >
                    Edit Game
                </button>

                {/* TODO: add 'did you you mean to save' modal if there's unsaved game state and back button is clicked */}

                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    // className="transition duration-300 text-mpblue py-1 px-3 mb-4 hover:text-mpblue hover:bg-transparent"
                    className={classNames('transition duration-300 text-mpblue py-1 px-3 hover:text-mpblue hover:bg-transparent', {
                        'hidden': !isEditing,
                    })}
                >
                    Go Back
                </button>
            </div>

            {renderWhenEditing()}

            {!isEditing && (
                <>
                    <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 sm:flex flex-wrap items-center justify-between shadow-sm">

                        <div className="pb-6 md:pb-0 text-center">
                            <h3 className="text-3xl">{opponent_name}</h3>
                            <h4 className="text-sm">{location_name}</h4>
                            <h4 className="text-sm">{start_date && format(parseISO(start_date), 'PPPP @ pp')}</h4>
                        </div>

                        {has_been_played && (
                            <div className="overflow-scroll">
                                <table className="m-auto md:m-0">
                                    <thead>
                                        <tr>
                                            <th> </th>
                                            <th>1</th>
                                            <th>2</th>
                                            <th>3</th>
                                            <th>4</th>
                                            <th>Final</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td className="pr-4 border-b border-gray-200 whitespace-nowrap">Patriots</td>
                                            {usScores.map((score) => <td key={score} className="px-3 md:px-6 py-1 border border-gray-200">{game[score]}</td>)}
                                            <td className="px-3 md:px-6 py-1 border border-gray-200">{game.goals_for}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-4 whitespace-nowrap">{opponent_name}</td>
                                            {opponentScores.map((score) => <td key={score} className="px-3 md:px-6 py-1 border border-gray-200">{game[score]}</td>)}
                                            <td className="px-3 md:px-6 py-1 border border-gray-200">{game.goals_against}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>

                    {!has_been_played ? (
                        <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                            <p className="text-center">Game stats are not yet available</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                                <Title>Team Stats</Title>
                                <table className="">
                                    <thead>
                                        <tr>
                                            <th> </th>
                                            <th className="pb-1 text-xs font-normal">G</th>
                                            <th className="pb-1 text-xs font-normal">GB</th>
                                            <th className="pb-1 text-xs font-normal">SH</th>
                                            <th className="pb-1 text-xs font-normal">FO</th>
                                            <th className="pb-1 text-xs font-normal">PIM</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="border-b border-mpred">
                                            <td className="md:pr-4 whitespace-nowrap w-full border-r border-mpred md:w-auto">Patriots</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.us_goals_for}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.us_ground_balls}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.us_shots}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.us_faceoffs_won}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.us_penalties_in_minutes}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-1 md:pr-4 whitespace-nowrap w-full border-r border-mpred md:w-auto">{opponent_name}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.opponent_goals_for}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.opponent_ground_balls}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.opponent_shots}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.opponent_faceoffs_won}</td>
                                            <td className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{game.opponent_penalties_in_minutes}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                                <Table
                                    headers={playerHeaders}
                                    columns={playerColumns}
                                    body={player_stats}
                                    title="Player Stats"
                                    empty="No player stats available"
                                />
                            </div>

                            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                                <Table
                                    headers={goalieHeaders}
                                    columns={goalieColumns}
                                    body={goalie_stats}
                                    title="Goalie Stats"
                                    empty="No goalie stats available"
                                />
                            </div>

                            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                                <Title>Game Notes</Title>
                                <p>{game.notes}</p>
                            </div>
                        </>
                    )}
                </>
            )}
        </main>
    );
};

export default Game;
