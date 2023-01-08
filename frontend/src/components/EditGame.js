// /* eslint-disable  */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { Table, Title, Modal, Loader } from '.';
import { useForm } from '../hooks';
import { EditPlayerStatsModal, AddPlayerGameStatsModal } from './modals';
import { updateGame } from '../redux/slices/gamesSlice';
import { MyModal } from './Modal';


const EditGame = ({ setIsEditing, playerHeaders, playerColumns }) => {
    const { game, players, isLoading } = useSelector(state => ({ ...state.games, ...state.players }));
    const { teams, locations } = useSelector(state => state.misc);
    const [showEditPlayerStatsModal, setShowEditPlayerStatsModal] = useState(false);
    const [showAddPlayerStatsModal, setShowAddPlayerStatsModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [_playerHeaders, _setPlayerHeaders] = useState(playerHeaders);
    const [_playerColumns, _setPlayerColumns] = useState(playerColumns);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [ourScore, setOurScore] = useState({});

    const { fields, handleChange } = useForm(game);
    const dispatch = useDispatch();

    const gameStringed = JSON.stringify(game);
    const fieldsStringed = JSON.stringify(fields);

    const hideCols = ['PTS', 'Shts%'];

    useEffect(() => {
        _setPlayerHeaders([...playerHeaders].filter(header => !hideCols.includes(header.label)));
        const { points, sog_percent, ...restOfPlayerColumns } = playerColumns;
        _setPlayerColumns({ ...restOfPlayerColumns });

        // _setPlayerHeaders([...playerHeaders, { label: '' }]);

        // _setPlayerColumns({
        //     ...playerColumns,
        //     points: '',
        //     // edit: {
        //     //     type: 'button',
        //     //     func: (e) => {
        //     //         console.log(gameStringed === fieldsStringed)

        //     //         if (gameStringed !== fieldsStringed) {
        //     //             console.log('getting here')
        //     //             return alert('Please save game before adding player stats');
        //     //         }
        //     //         setShowEditPlayerStatsModal(true);
        //     //         setSelectedPlayer(e);
        //     //         return true;
        //     //     },
        //     //     as: 'Edit',
        //     //     className: 'w-0 whitespace-nowrap',
        //     // },
        // });
    }, [gameStringed, fieldsStringed]);


    useEffect(() => {
        const playerStats = document.querySelectorAll('[data-player-stats]');

        const goalsByPlayerId = ([...playerStats] || []).reduce((acc, curr) => {
            const [playerId, key] = curr.dataset.playerStats.split('-');

            if (key === 'goals') {
                return { ...acc, [playerId]: parseInt(curr.value) };
            }
            return acc;
        }, {});

        setOurScore(goalsByPlayerId);
    }, []);

    const { opponent_name, player_stats } = game;
    const usScoreTotal = fields.us_scores_first + fields.us_scores_second + fields.us_scores_third + fields.us_scores_fourth + fields.us_scores_overtime;
    // eslint-disable-next-line no-param-reassign
    const goalsAccountedFor = player_stats.reduce((acc, tot) => acc += tot.goals, 0);
    const formattedLocations = locations.map(loc => ({ label: loc.name, value: loc.id, address: loc.address }));
    const formattedTeams = teams.map(team => ({ label: team.name, value: team.id }));


    const renderGoalsNotAccountedFor = () => {
        const myReducedValue = Object.keys(ourScore).reduce((acc, curr) => acc + ourScore[curr], 0);

        if (myReducedValue !== usScoreTotal) {
            return (
                <p className="text-sm text-mpred">WARNING: There {usScoreTotal - myReducedValue === 1 ? 'is' : 'are'} {usScoreTotal - myReducedValue} {usScoreTotal - myReducedValue === 1 ? 'goal' : 'goals'} not accounted for in the player stats below</p>
            );
        }

        if (!usScoreTotal) {
            return (
                <p className="text-sm text-mpred">Add scores to assign goals to players</p>
            );
        }

        return null;
    };

    const formatOptionLabel = ({ label, address }) => (
        <div>
            <p>{label}</p>
            <p className="text-gray-400 text-xs"> {address}</p>
        </div>
    );

    return (
        <>
            <Modal isOpen={showEditPlayerStatsModal} onClose={setShowEditPlayerStatsModal}>
                {(closeModal) => <EditPlayerStatsModal closeModal={closeModal} player={selectedPlayer} gameId={game.game_id} seasonId={game.season_id} totalGoalsAllowed={goalsAccountedFor} totalGoals={usScoreTotal} />}
            </Modal>

            <Modal isOpen={showAddPlayerStatsModal} onClose={setShowAddPlayerStatsModal}>
                {(closeModal) => <AddPlayerGameStatsModal closeModal={closeModal} playersAlreadyPlaying2={player_stats} gameId={game.game_id} seasonId={game.season_id} totalGoalsAllowed={goalsAccountedFor} totalGoals={usScoreTotal} />}
            </Modal>

            <MyModal isOpen={showErrorModal} onClose={setShowErrorModal}>
                <div className="max-w-md w-full">
                    <div className="bg-mpred h-11 px-4 flex items-center justify-between">
                        <h3 className="text-white font-bold uppercase tracking-wider">Error</h3>
                        <button type="button" className="p-1 mb-0.5 text-3xl text-white" onClick={() => setShowErrorModal(false)}>
                            &times;
                        </button>
                    </div>

                    <div className="p-4">
                        <p className="mb-8">
                            Player goals and scoring per quarter totals do not match up. Please make player goal totals the same as goals per quarter totals.
                        </p>

                        <button
                            className="w-1/2 sm:w-auto transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                            type="button"
                            onClick={() => setShowErrorModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </MyModal>

            <Loader loading={isLoading} />

            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <div className="sm:flex sm:gap-5">
                    <div className="mb-2 w-full">
                        {/* <label htmlFor="opponent" className="text-sm text-gray-800">Opponent</label>
                        <input value={fields.opponent_name} onChange={handleChange} type="text" name="opponent" id="opponent" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}

                        <label htmlFor="opponent" className="text-sm text-gray-800">Opponent</label>
                        {/* <input value={fields.location} onChange={handleChange} type="text" name="location" id="location" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}
                        <Select
                            options={formattedTeams}
                            onChange={e => handleChange(null, e.value, 'opponent_id')}
                            value={formattedTeams.filter((option) => option.value === parseInt(fields.opponent_id))[0]}
                        />
                    </div>

                    <div className="mb-2 w-full">
                        {/* <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        <input value={fields.location} onChange={handleChange} type="text" name="location" id="location" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
 */}

                        <label htmlFor="opponent" className="text-sm text-gray-800">Start Time</label>
                        {/* <input value={parseISO(fields.start_date)} onChange={handleChange} type="text" name="opponent" id="opponent" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}
                        <input value={new Date(fields.start_date).toLocaleString()} onChange={handleChange} type="text" name="start_date" id="start_date" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />

                    </div>
                </div>

                <div className="sm:flex sm:gap-5">
                    <div className="mb-2 w-full">

                        <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        <Select
                            options={formattedLocations}
                            onChange={e => handleChange(null, e.value, 'location_id')}
                            formatOptionLabel={formatOptionLabel}
                            value={formattedLocations.filter((option) => option.value === parseInt(fields.location_id))[0]}
                        />

                        {/* <DateTimePicker onChange={e => handleChange(null, e, 'start_date')} value={'Tue Mar 01 2022 07:39:22 GMT-0500 (Eastern Standard Time)'} /> */}
                    </div>
                    {/* <div className="mb-2 w-full">
                        <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        <input value={fields.is_home} onChange={handleChange} type="text" name="location" id="location" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div> */}
                    <div className="mb-2 w-full">
                        <div className="flex pt-4 md:pt-10">
                            <input checked={fields.is_home} onChange={handleChange} type="checkbox" maxLength={4} name="is_home" id="is_home" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                            <label htmlFor="is_home" className="pl-3  text-sm text-gray-800">Home Game?</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <Title>Scoring - Edit</Title>

                <div className="overflow-scroll mb-4">
                    <table className="m-auto md:m-0 mb-5">
                        <thead>
                            <tr>
                                <th> </th>
                                <th className="py-1 px-3 border-r whitespace-nowrap">Quarter 1</th>
                                <th className="py-1 px-3 border-r whitespace-nowrap">Quarter 2</th>
                                <th className="py-1 px-3 border-r whitespace-nowrap">Quarter 3</th>
                                <th className="py-1 px-3 border-r whitespace-nowrap">Quarter 4</th>
                                <th className="py-1 px-3">Final</th>

                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="p-1 mx-2 pr-6">Patriots</td>
                                {/* <td className="text-sm text-gray-800 text-center" colSpan={"100%"}>Our scoring is calculated by player scoring inputs below</td> */}
                                <td className="text-center">
                                    <input value={fields.us_scores_first} onChange={handleChange} min={0} type="number" maxLength={4} name="us_scores_first" id="us_scores_first" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.us_scores_second} onChange={handleChange} min={0} type="number" maxLength={4} name="us_scores_second" id="us_scores_second" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.us_scores_third} onChange={handleChange} min={0} type="number" maxLength={4} name="us_scores_third" id="us_scores_third" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.us_scores_fourth} onChange={handleChange} min={0} type="number" maxLength={4} name="us_scores_fourth" id="us_scores_fourth" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    {/* <p>{fields.us_scores_first + fields.us_scores_second + fields.us_scores_third + fields.us_scores_fourth}</p> */}
                                    <p>{usScoreTotal}</p>
                                    {/* <p>{bb}</p> */}
                                    {/* <p>{ourScore}</p> */}

                                </td>
                            </tr>

                            <tr>
                                <td className="p-1 mx-2 pr-6">{opponent_name}</td>
                                <td className="text-center">
                                    <input value={fields.opponent_scores_first} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_scores_first" id="opponent_scores_first" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.opponent_scores_second} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_scores_second" id="opponent_scores_second" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.opponent_scores_third} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_scores_third" id="opponent_scores_third" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.opponent_scores_fourth} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_scores_fourth" id="opponent_scores_fourth" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>

                                <td className="text-center">
                                    <p>{fields.opponent_scores_first + fields.opponent_scores_second + fields.opponent_scores_third + fields.opponent_scores_fourth}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {renderGoalsNotAccountedFor()}
            </div>


            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <Title>Team Stats - Edit</Title>

                <div className="overflow-scroll">
                    <table className="m-auto md:m-0 mb-5">
                        <thead>
                            <tr>
                                <th> </th>
                                {/* <th className="py-1 px-3 border-r">Goals</th> */}
                                <th className="py-1 px-3 border-r whitespace-nowrap">Ground Balls</th>
                                <th className="py-1 px-3 border-r whitespace-nowrap">Shots</th>
                                <th className="py-1 px-3 border-r whitespace-nowrap">Faceoff Wins</th>
                                <th className="py-1 px-3 whitespace-nowrap">Penalty Minutes</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="p-1 mx-2 pr-6">Patriots</td>
                                <td className="text-sm text-gray-800 text-center" colSpan="100%">Our stats are calculated by player scoring inputs below</td>
                            </tr>

                            <tr>
                                <td className="p-1 mx-2 pr-6 whitespace-nowrap">{opponent_name}</td>
                                {/* <td className="text-center">
                                    <input value={fields.opponent_goals_for} onChange={handleChange} type="number" maxLength={4} name="opponent_goals_for" id="opponent_goals_for" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td> */}
                                <td className="text-center">
                                    <input value={fields.opponent_ground_balls} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_ground_balls" id="opponent_ground_balls" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.opponent_shots} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_shots" id="opponent_shots" className="w-16 mx-3 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.opponent_faceoffs_won} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_faceoffs_won" id="opponent_faceoffs_won" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                                <td className="text-center">
                                    <input value={fields.opponent_penalties_in_minutes} onChange={handleChange} min={0} type="number" maxLength={4} name="opponent_penalties_in_minutes" id="opponent_penalties_in_minutes" className="w-16 rounded form-input border border-gray-300 pl-2 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">

                <div className="flex justify-between">
                    <Title>Player Stats - Edit</Title>
                    {renderGoalsNotAccountedFor()}
                </div>

                {/* <Table
                    headers={_playerHeaders}
                    columns={_playerColumns}
                    body={player_stats || []}
                    // title="Player Stats - Edit"
                    disableSort
                /> */}

                <Table
                    headers={_playerHeaders}
                    columns={_playerColumns}
                    body={player_stats || []}
                    // title="Player Stats - Edit"
                    disableSort
                    editFields={{
                        goals: 'number',
                        assists: 'number',
                        sog: 'number',
                        ground_balls: 'number',
                        penalties_in_minutes: 'number',
                    }}
                    // NEED TO FIGURE THIS OUT NEXT CAUSE IDK WHATS HAPPENING
                    inputOnChange={e => {
                        const [playerId, key] = e.target.dataset.playerStats.split('-');
                        if (key === 'goals') {
                            setOurScore({ ...ourScore, [playerId]: parseInt(e.target.value) });
                        }
                    }}
                />
                <div className="flex items-center mt-6 mb-4 ">
                    <button
                        type="button"
                        onClick={() => setShowAddPlayerStatsModal(!showAddPlayerStatsModal)}
                        className="transition duration-300 border-mpblue text-mpblue py-1 px-3 hover:text-white hover:bg-mpblue disabled:bg-mpblue disabled:text-white disabled:opacity-30"
                        disabled={players?.length <= game.player_stats?.length}
                    >
                        + Add Player
                    </button>

                    {players.length <= game.player_stats?.length && (
                        <p className="ml-4 text-sm">All current players are playing in this game</p>
                    )}
                </div>

            </div>


            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <Title>Goalie Stats - Edit</Title>
                <div className="flex">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        // className="transition duration-300  border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                        className="transition duration-300 border-mpblue text-mpblue py-1 px-3 hover:text-white hover:bg-mpblue disabled:bg-mpblue disabled:text-white disabled:opacity-30"
                        disabled
                    >
                        + Add Goalie
                    </button>
                </div>

            </div>

            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <Title>Game Notes - Edit</Title>
                <div>

                    <textarea
                        name="notes"
                        className="border border-gray-300 p-3 w-full h-36"
                        value={fields.notes || ''}
                        onChange={handleChange}
                    />
                </div>


            </div>

            {/* <div className="flex justify-end"> */}
            <div className="px-4 pb-4 pt-3 flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="transition duration-300 text-mpblue py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                >
                    Go Back
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        // TODO: need to clean this up 
                        const myReducedValue = Object.keys(ourScore).reduce((acc, curr) => acc + ourScore[curr], 0);

                        if (usScoreTotal - myReducedValue !== 0) {
                            return setShowErrorModal(true);
                        }

                        const playerStats = document.querySelectorAll('[data-player-stats]');
                        // console.log(playerStats[0].dataset, 'dataset');
                        const bb = [...playerStats].map(item => ({
                            [item.dataset.playerStats]: item.value,
                        }));


                        const valuesFromTableInputs = bb.reduce((acc, curr) => {
                            const [playerId, type] = Object.keys(curr)[0].split('-');
                            const [val] = Object.values(curr);
                            return { ...acc, [playerId]: { ...acc[playerId], [type]: val } };
                        }, {});

                        console.log(fields, 'FIELDSSS')

                        // const valuesFromTableInputs = getDataAttr();
                        // console.log(valuesFromTableInputs, 'valuesFromTableInputs');
                        // console.log(bb, 'bbbbbbbb')
                        console.log({ ...fields, playerStats: valuesFromTableInputs });


                        // if (goalsAccountedFor > usScoreTotal) {
                        //     return alert('Update player scores before saving game');
                        // }
                        const b = await dispatch(updateGame({ ...fields, playerStats: valuesFromTableInputs }));
                        if (!!b) setIsEditing(false);
                        return true;
                    }}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 hover:text-white hover:bg-mpblue"
                // className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"

                >
                    Save Game
                </button>
            </div>

            {/* <div className="px-4 pb-4 pt-3 border-t border-gray-300 flex justify-end">
                    <button
                        type="button"
                        // onClick={closeModal}
                        className="transition duration-300 text-mpred py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        // onClick={closeModal}
                        type="submit"
                        className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                    >
                        Create Player
                    </button>
                </div> */}
        </>
    );
};

export default EditGame;

EditGame.propTypes = {
    setIsEditing: PropTypes.func.isRequired,
    playerHeaders: PropTypes.array.isRequired,
    playerColumns: PropTypes.object.isRequired,
};


const getDataAttr = () => {
    const playerStats = document.querySelectorAll('[data-player-stats]');
    console.log(playerStats[0].dataset, 'dataset');
    const bb = [...playerStats].map(item => ({
        [item.dataset.playerStats]: item.value,
    }));

    console.log(bb, 'bbbbb');


    const valuesFromTableInputs = bb.reduce((acc, curr) => {
        const [playerId, type] = Object.keys(curr)[0].split('-');
        const [val] = Object.values(curr);
        return {
            ...acc,
            [playerId]: { ...acc[playerId], [type]: val },
        };
    }, {});

    console.log(valuesFromTableInputs, 'valuesFromTableInputs');
    return valuesFromTableInputs;
};
