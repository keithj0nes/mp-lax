import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Title } from '.';
import { quickAddPlayersToGame } from '../redux/slices/gamesSlice';


const QuickAddPlayersToGame = ({ setIsEditing, isEditing }) => {
    const [checkedPlayersInGame, setCheckedPlayersInGame] = useState([]);
    const { game, players } = useSelector(state => ({ ...state.games, ...state.players }));
    const dispatch = useDispatch();

    const { name } = game;

    const handleCheckboxChange = player => {
        const checkedPlayersInGameCopy = [...checkedPlayersInGame];
        const index = checkedPlayersInGameCopy.findIndex(item => item.player_id === player.player_id);
        if (index === -1) {
            checkedPlayersInGameCopy.push(player);
        } else {
            checkedPlayersInGameCopy.splice(index, 1);
        }
        setCheckedPlayersInGame(checkedPlayersInGameCopy);
    };

    const selectAll = e => {
        if (e.target.checked) {
            setCheckedPlayersInGame(players.map(player => ({ player_id: player.player_id, player_number: player.player_number })));
        } else {
            setCheckedPlayersInGame([]);
        }
    };

    return (
        <>
            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <Title>{`Quick add players to the ${name} game`}</Title>

                <div className="my-2 flex">
                    <input type="checkbox" id="check-all" checked={checkedPlayersInGame.length === players.length} onChange={selectAll} className="mt-1 cursor-pointer rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    <label htmlFor="check-all" className="pl-3 text-sm text-gray-800 cursor-pointer">Select All</label>
                </div>

                {players.map(item => (
                    <div className="my-2 flex" key={item.player_id}>
                        {/* <input checked={fields.is_home} onChange={handleChange} type="checkbox" maxLength={4} name="is_home" id="is_home" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}
                        <input type="checkbox" checked={checkedPlayersInGame.find(pl => pl.player_id === item.player_id)} id={item.player_id} onChange={() => handleCheckboxChange({ player_id: item.player_id, player_number: item.player_number })} className="mt-1 cursor-pointer rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <label htmlFor={item.player_id} className="pl-3 text-sm text-gray-800 cursor-pointer">{item.first_name} {item.last_name} #{item.player_number}</label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="transition duration-300 text-mpred py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => {
                        dispatch(quickAddPlayersToGame({ players: checkedPlayersInGame, gameId: game.game_id }));
                    }}
                    className="transition duration-300 border border-mpblue py-1 px-3 text-mpblue hover:bg-mpblue hover:text-white disabled:bg-transparent disabled:text-mpblue disabled:opacity-40"
                    // className="transition duration-300 border-mpblue text-mpblue py-1 px-3 hover:text-white hover:bg-mpblue disabled:bg-mpblue disabled:text-white disabled:opacity-40"
                    disabled={!checkedPlayersInGame.length}
                >
                    Quick Add
                </button>
            </div>
        </>
    );
};

export default QuickAddPlayersToGame;

QuickAddPlayersToGame.propTypes = {
    setIsEditing: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
};
