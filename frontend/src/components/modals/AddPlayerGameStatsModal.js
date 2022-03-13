import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useForm } from '../../hooks';
import { addPlayerGameStats } from '../../redux/slices/gamesSlice';
import { Select } from '..';

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

const AddPlayerGameStatsModal = ({ closeModal, playersAlreadyPlaying2, gameId: game_id, seasonId: season_id, totalGoalsAllowed, totalGoals }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [showDropdownError, setShowDropdownError] = useState(false);
    const { fields, handleChange } = useForm({ ...initialState });
    const dispatch = useDispatch();

    const { players } = useSelector(state => state.players);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedValue) {
            setShowDropdownError(true);
        }
        const playerStats = { ...selectedValue.value, ...fields, game_id, season_id };
        dispatch(addPlayerGameStats(playerStats));
        closeModal();
    };

    const renderInputs = () => Object.keys(initialState).map(item => {
        if (item === 'goals') {
            const bb = totalGoalsAllowed;
            const useThis = (totalGoals - bb) - fields[item];
            return (
                <div className="mb-2 items-center w-full" key={item}>
                    <label htmlFor={item} className="text-sm text-gray-800 w-5/12 inline-block">{initialStateTypes[item]}</label>
                    <input value={fields[item]} min={0} max={totalGoals - totalGoalsAllowed} step={item === 'penalties_in_minutes' ? '0.5' : 'any'} onChange={handleChange} type="number" name={item} id={item} className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    <div className="bg-yellow-100 w-5/12 inline-block" />
                    <p className={classNames('w-7/12 inline-block pt-1 px-2 text-sm', {
                        'text-mpred': !useThis,
                    })}
                    >
                        {!useThis ? 'All goals accounted for' : `${useThis} goals remaining` }
                    </p>
                </div>
            );
        }

        return (
            <div className="mb-2 items-center w-full" key={item}>
                <label htmlFor={item} className="text-sm text-gray-800 w-5/12 inline-block">{initialStateTypes[item]}</label>
                <input value={fields[item]} min={0} onChange={handleChange} type="number" name={item} id={item} className="mt-1 w-7/12 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
            </div>
        );
    });

    const playerFilter2 = playersAlreadyPlaying2.map(item => item.player_id);

    const filtered2 = players.filter(item => !playerFilter2.includes(item.player_id));

    const optionsExample = filtered2.map(item => ({ value: { player_id: item.player_id, player_number: item.player_number }, label: `${item.first_name} ${item.last_name} #${item.player_number}` }));

    console.log(selectedValue, 'selectedValue')
    return (
        <div className="bg-red-10 w-96">
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">Add Player Stats</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    <Select
                        options={optionsExample}
                        onChange={option => {
                            setSelectedValue(option);
                            setShowDropdownError(false);
                        }}
                        value={selectedValue}
                    />
                    <p className={`pt-0.5 mb-3 text-xs text-mpred transition duration-300 ${showDropdownError ? 'text-opacity-100' : 'text-opacity-0'}`}>
                        Player required
                        <span className="after:content-['.'] invisible" />
                    </p>

                    {renderInputs()}
                </div>

                <div className="px-4 pb-4 pt-3 border-t border-gray-300 flex justify-end">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="transition duration-300 text-mpred py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPlayerGameStatsModal;

AddPlayerGameStatsModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    playersAlreadyPlaying2: PropTypes.array.isRequired,
    gameId: PropTypes.number.isRequired,
    seasonId: PropTypes.number.isRequired,
    totalGoalsAllowed: PropTypes.number.isRequired,
    totalGoals: PropTypes.number.isRequired,
};
