// /* eslint-disable  */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Title, Modal, Loader } from '.';
import { useForm } from '../hooks';
import { EditPlayerStatsModal, AddPlayerGameStatsModal } from './modals';
import { updateGame } from '../redux/slices/gamesSlice';

// const initialState = {
//     opponent_goals_for: 0,
//     opponent_ground_balls: 0,
//     opponent_shots: 0,
//     opponent_faceoffs_won: 0,
//     opponent_penalties_in_minutes: 0,
//     location: '',
//     opponent: ''
// }

const EditGame = ({ setIsEditing, playerHeaders, playerColumns }) => {
    const { game, players, isLoading } = useSelector(state => ({ ...state.games, ...state.players }));
    const [showEditPlayerStatsModal, setShowEditPlayerStatsModal] = useState(false);
    const [showAddPlayerStatsModal, setShowAddPlayerStatsModal] = useState(false);
    const [_playerHeaders, _setPlayerHeaders] = useState(playerHeaders);
    const [_playerColumns, _setPlayerColumns] = useState(playerColumns);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const { fields, handleChange } = useForm(game);
    const dispatch = useDispatch();


    useEffect(() => {
        _setPlayerHeaders([...playerHeaders, { label: '' }]);
        _setPlayerColumns({
            ...playerColumns,
            edit: {
                type: 'button',
                func: (e) => {
                    setShowEditPlayerStatsModal(true);
                    setSelectedPlayer(e);
                },
                as: 'Edit',
                className: 'w-0 whitespace-nowrap',
            },
        });
    }, []);

    const { opponent, player_stats } = game;
    const usScoreTotal = fields.us_scores_first + fields.us_scores_second + fields.us_scores_third + fields.us_scores_fourth + fields.us_scores_overtime;
    // eslint-disable-next-line no-param-reassign
    const goalsAccountedFor = player_stats.reduce((acc, tot) => acc += tot.goals, 0);

    // console.log(goalsAccountedFor, 'goalsAccountedFor')
    //   console.log(usScoreTotal - goalsAccountedFor)

    const renderGoalsNotAccountedFor = () => {
        if (goalsAccountedFor !== usScoreTotal) {
            return (
                <p className="text-sm text-mpred">WARNING: There {usScoreTotal - goalsAccountedFor === 1 ? 'is' : 'are'} {usScoreTotal - goalsAccountedFor} {usScoreTotal - goalsAccountedFor === 1 ? 'goal' : 'goals'} not accounted for in the player stats below</p>
            );
        }

        if (!usScoreTotal) {
            return (
                <p className="text-sm text-mpred">Add scores to assign goals to players</p>
            );
        }

        return null;
    };

    return (
        <>
            <Modal isOpen={showEditPlayerStatsModal} onClose={setShowEditPlayerStatsModal}>
                {(closeModal) => <EditPlayerStatsModal closeModal={closeModal} player={selectedPlayer} gameId={game.game_id} seasonId={game.season_id} totalGoalsAllowed={goalsAccountedFor} totalGoals={usScoreTotal} />}
            </Modal>

            <Modal isOpen={showAddPlayerStatsModal} onClose={setShowAddPlayerStatsModal}>
                {(closeModal) => <AddPlayerGameStatsModal closeModal={closeModal} playersAlreadyPlaying2={player_stats} gameId={game.game_id} seasonId={game.season_id} totalGoalsAllowed={goalsAccountedFor} totalGoals={usScoreTotal} />}
            </Modal>

            <Loader loading={isLoading} />

            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <div className="sm:flex sm:gap-5">
                    <div className="mb-2 w-full">
                        <label htmlFor="opponent" className="text-sm text-gray-800">Opponent</label>
                        <input value={fields.opponent} onChange={handleChange} type="text" name="opponent" id="opponent" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>

                    <div className="mb-2 w-full">
                        <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        <input value={fields.location} onChange={handleChange} type="text" name="location" id="location" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
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
                                <th className="py-1 px-3 border-r">Quarter 1</th>
                                <th className="py-1 px-3 border-r">Quarter 2</th>
                                <th className="py-1 px-3 border-r">Quarter 3</th>
                                <th className="py-1 px-3 border-r">Quarter 4</th>
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
                                </td>
                            </tr>

                            <tr>
                                <td className="p-1 mx-2 pr-6">{opponent}</td>
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
                                <th className="py-1 px-3 border-r">Ground Balls</th>
                                <th className="py-1 px-3 border-r">Shots</th>
                                <th className="py-1 px-3 border-r">Faceoff Wins</th>
                                <th className="py-1 px-3">Penalty Minutes</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="p-1 mx-2 pr-6">Patriots</td>
                                <td className="text-sm text-gray-800 text-center" colSpan="100%">Our stats are calculated by player scoring inputs below</td>
                            </tr>

                            <tr>
                                <td className="p-1 mx-2 pr-6">{opponent}</td>
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

                <Table
                    headers={_playerHeaders}
                    columns={_playerColumns}
                    body={player_stats || []}
                    // title="Player Stats - Edit"
                    disableSort
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
                        const b = await dispatch(updateGame(fields));
                        if (!!b) setIsEditing(false);
                    }}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 hover:text-white hover:bg-mpblue"
                    // className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"

                >
                    Save
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
