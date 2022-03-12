/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
// import toRegexRange from 'to-regex-range';
// import { getDatabase, ref, set } from "firebase/database";
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
// import { customAlphabet } from 'nanoid'
import { useForm } from '../../hooks';
// import { request } from '../../request';
import { PopConfirm, Loader } from '..';
import { removePlayerFromGame, updatePlayerGameStats } from '../../redux/slices/gamesSlice';

// const validFromYear = new Date().getFullYear() - 3;
// const validToYear = validFromYear + 6;
// const validYearsRegex = toRegexRange(validFromYear, validToYear, { capture: true });

const initialState = {
    goals: 0,
    assists: 0,
    sog: 0,
    ground_balls: 0,
    interceptions: 0,
    takeaways: 0,
    unforced_errors: 0,
    penalties: 0,
    penalties_in_minutes: 0,
};

const initialStateTypes = {
    goals: 'Goals',
    assists: 'Assists',
    sog: 'Shots on Goal',
    ground_balls: 'Ground Balls',
    interceptions: 'Interceptions',
    takeaways: 'Takeaways',
    unforced_errors: 'Unforced Errors',
    penalties: 'Penalties',
    penalties_in_minutes: 'Penalties In Minutes',
};

const EditPlayerStatsModal = ({ closeModal, player, gameId: game_id, seasonId: season_id, totalGoalsAllowed, totalGoals }) => {
    // const { fields, handleChange, errors, validate } = useForm(initialState);
    const { last_name, first_name, number, ...rest } = player;
    const { fields, handleChange } = useForm({ ...initialState, ...rest });

    const { isLoading } = useSelector(state => state.games);

    const dispatch = useDispatch();

    // console.log(rest.goals, totalGoalsAllowed, 'rest goals')

    // console.log(totalGoalsAllowed - rest.goals, 'totalGoalsAllowed')
    const handleSubmit = (e) => {
        e.preventDefault();
        // const isValidated = validate(validations)
        // console.log(isValidated, 'isValidated')
        // console.log(fields, 'fields!!!!!')
        // console.log(errors, 'errors!!!!!')
        // console.log({...player, ...fields, game_id, season_id},' fields')
        // if (!isValidated) return;

        // console.log('SUBMIT FUNCTION HERE!!!')
        const playerStats = { ...player, ...fields, game_id, season_id };

        // await dispatch and show loader until success
        dispatch(updatePlayerGameStats(playerStats));
        closeModal();
    };

    const handleRemovePlayerFromGame = async () => {
        await dispatch(removePlayerFromGame(player));
        closeModal();
    };

    console.log(player, 'plaery');

    const renderInputs = () => Object.keys(initialState).map(item => {
        if (item === 'goals') {
            const bb = totalGoalsAllowed - rest.goals;
            const useThis = (totalGoals - bb) - fields[item];
            return (
                <div className="mb-2 items-center w-full" key={item}>
                    <label htmlFor={item} className="text-sm text-gray-800 w-5/12 inline-block">{initialStateTypes[item]}</label>
                    <input value={fields[item]} min={0} max={rest.goals + totalGoals - totalGoalsAllowed} step={item === 'penalties_in_minutes' ? '0.5' : 'any'} onChange={handleChange} type="number" name={item} id={item} className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    <div className="bg-yellow-100 w-5/12 inline-block" />
                    <p className={classNames('w-7/12 inline-block pt-1 px-2 text-xs', {
                        'text-mpred': !useThis,
                    })}
                    >
                        {!useThis ? 'All goals accounted for' : `${useThis} ${useThis === 1 ? 'goal' : 'goals'} remaining` }
                    </p>
                </div>
            );
        }

        return (
            <div className="mb-2 items-center w-full" key={item}>
                <label htmlFor={item} className="text-sm text-gray-800 w-5/12 inline-block">{initialStateTypes[item]}</label>
                <input value={fields[item]} min={0} step={item === 'penalties_in_minutes' ? '0.5' : 'any'} onChange={handleChange} type="number" name={item} id={item} className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
            </div>
        );
    });

    return (
        <div className="bg-red-10 w-96">
            <Loader loading={isLoading} />
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">Edit Player Stats</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    {/* <div className="mb-2">
                        <label className="text-sm text-gray-800">Season</label>
                        <Select options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                    </div> */}


                    <div className="mb-5 flex justify-between">
                        <p>{player.first_name} {player.last_name}</p>
                        <p>#{player.player_number}</p>
                    </div>

                    {renderInputs()}


                    {/* different layout */}

                    {/* <div className="flex gap-6">
                        <div className="mb-2 ">
                            <label htmlFor="goals" className="text-sm text-gray-800 block">G - Goals</label>
                            <input value={fields.goals} onChange={handleChange}  type="text" name="goals" id="goals" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="assists" className="text-sm text-gray-800 block">A - Assists</label>
                            <input value={fields.assists} onChange={handleChange} type="text" name="assists" id="assists" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="mb-2 ">
                            <label htmlFor="goals" className="text-sm text-gray-800 block">SOG - Shots On Goal</label>
                            <input value={fields.goals} onChange={handleChange}  type="text" name="goals" id="goals" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="assists" className="text-sm text-gray-800 block">GB - Ground Balls</label>
                            <input value={fields.assists} onChange={handleChange} type="text" name="assists" id="assists" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="mb-2 ">
                            <label htmlFor="goals" className="text-sm text-gray-800 block">INT - Interceptions</label>
                            <input value={fields.goals} onChange={handleChange}  type="text" name="goals" id="goals" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="assists" className="text-sm text-gray-800 block">TA - Takeaways</label>
                            <input value={fields.assists} onChange={handleChange} type="text" name="assists" id="assists" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="mb-2 ">
                            <label htmlFor="goals" className="text-sm text-gray-800 block">UE - Unforced Errors</label>
                            <input value={fields.goals} onChange={handleChange}  type="text" name="goals" id="goals" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="mb-2">
                            <label htmlFor="assists" className="text-sm text-gray-800 block">Pen - Penalties</label>
                            <input value={fields.assists} onChange={handleChange} type="text" name="assists" id="assists" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="assists" className="text-sm text-gray-800 block">PIM - Penalties In Minutes</label>
                            <input value={fields.assists} onChange={handleChange} type="text" name="assists" id="assists" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>
                    </div> */}


                    {/* <div className="mb-2 items-center w-full">
                        <label htmlFor="goals" className="text-sm text-gray-800 w-5/12 inline-block">Goals</label>
                        <input value={fields.goals} onChange={handleChange} type="number" name="goals" id="goals" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="mb-2 items-center w-full">
                        <label htmlFor="assists" className="text-sm text-gray-800 w-5/12 inline-block">Assists</label>
                        <input value={fields.assists} onChange={handleChange} type="number" name="assists" id="assists" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">Shots On Goal</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">Ground Balls</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>

                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">Interceptions</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">TA</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">Unforced Errors</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>


                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">Penalties</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div>
                    <div className="mb-2 items-center w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800 w-5/12 inline-block">Penalties in Minutes</label>
                        <input value={fields.last_name} onChange={handleChange} type="number" name="last_name" id="last_name" className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div> */}
                </div>

                <div className="px-4 pb-4 pt-3 border-t border-gray-300 flex justify-between">

                    <PopConfirm onConfirm={handleRemovePlayerFromGame}>
                        Remove Player
                    </PopConfirm>

                    <div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="transition duration-300 text-mpred py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            // onClick={closeModal}
                            type="submit"
                            className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                        >
                            Update
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default EditPlayerStatsModal;

EditPlayerStatsModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    gameId: PropTypes.number.isRequired,
    seasonId: PropTypes.number.isRequired,
    totalGoalsAllowed: PropTypes.number.isRequired,
    totalGoals: PropTypes.number.isRequired,
};
