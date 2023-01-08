import { createSlice } from '@reduxjs/toolkit';
import { request } from '../../request';
import { wait } from '../../helpers';

const initialState = {
    games: [],
    game: {},
    singleGameLoading: true,
    isLoading: false,
};

export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        setIsLoadingR: (state, action) => {
            state.isLoading = action.payload === undefined ? true : action.payload;
        },
        setSingleGameLoadingR: (state, action) => {
            // state.game = {}
            state.singleGameLoading = action.payload === undefined ? true : action.payload;
        },
        getGamesR: (state, action) => {
            state.games = action.payload;
        },
        getGameByIdR: (state, action) => {
            state.game = action.payload;
            state.singleGameLoading = false;
        },
        clearGameByIdR: (state) => {
            state.game = {};
        },
        createGameR: (state, action) => {
            state.games = [...state.games, action.payload];
            state.isLoading = false;
        },
        updateGameR: (state, action) => {
            state.game = action.payload;
            state.isLoading = false;
        },
        addPlayerGameStatsR: (state, action) => {
            state.game = { ...state.game, ...action.payload.updatedGame, player_stats: [...state.game.player_stats, action.payload.addedPlayer] };
            // state.game = { ...state.game, player_stats: [...state.game.player_stats, action.payload] };
        },
        updatePlayerGameStatsR: (state, action) => {
            const player_stats = state.game.player_stats.map(item => {
                if (item.player_id === action.payload.updatedPlayer.player_id) {
                    return action.payload.updatedPlayer;
                }
                return item;
            });
            state.game = { ...state.game, ...action.payload.updatedGame, player_stats };
        },
        // removePlayerFromGameR: (state, action) => {

        // },
    },
});


// Action creators are generated for each case reducer function
export const { getGamesR, createGameR, getGameByIdR, addPlayerGameStatsR, updatePlayerGameStatsR, setSingleGameLoadingR, setIsLoadingR, clearGameByIdR, updateGameR } = gamesSlice.actions;
export default gamesSlice.reducer;


export const getAllGames = (query) => async (dispatch) => {
    try {
        const data = await request({ url: `/api/games?${query || ''}`, method: 'GET' });
        console.log(data, 'daattaaa');
        if (!data) return alert('error in getAllGames');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getGamesR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const getGameById = (game_id) => async (dispatch) => {
    // dispatch(setSingleGameLoadingR())

    // await wait(600)
    try {
        const data = await request({ url: `/api/games/${game_id}`, method: 'GET' });
        // console.log(data, 'daattaaa')
        if (!data) return alert('error in getGameById');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getGameByIdR(data.data));
        return true;
    } catch (err) {
        dispatch(setSingleGameLoadingR(false));
        throw new Error(err);
    }
};

export const createGame = (newGame) => async (dispatch) => {
    dispatch(setIsLoadingR());
    await wait(1000);
    try {
        const data = await request({ url: '/api/games', method: 'POST', session: newGame });
        console.log(data, 'data in createGame');
        if (!data) return alert('error in createGame');
        dispatch(createGameR(data.data));
        return true;
    } catch (err) {
        dispatch(setIsLoadingR(false));
        throw new Error(err);
        // return false
    }
};


export const updateGame = (gameDetails) => async (dispatch) => {
    console.log(gameDetails, 'gameDetails');
    dispatch(setIsLoadingR());
    await wait(1000);
    try {
        const data = await request({ url: `/api/games/${gameDetails.game_id}`, method: 'PUT', session: gameDetails });
        console.log(data, 'data in updateGame');
        if (!data) return alert('error in updateGame');
        dispatch(updateGameR(data.data));
        return true;
    } catch (err) {
        dispatch(setIsLoadingR(false));
        throw new Error(err);
        // return false
    }
};


export const updatePlayerGameStats = (playerStats) => async (dispatch) => {
    dispatch(setIsLoadingR());
    await wait(600);

    console.log(playerStats, ' playerStats game!!');
    const { game_id, player_id, ...rest } = playerStats;
    try {
        const data = await request({ url: `/api/games/${game_id}/${player_id}`, method: 'PUT', session: rest });
        console.log(data, 'data in updatePlayerGameStats');
        if (!data) return alert('error in updatePlayerGameStats');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(updatePlayerGameStatsR(data.data));
        dispatch(setIsLoadingR(false));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const addPlayerGameStats = (playerStats) => async (dispatch) => {
    dispatch(setIsLoadingR());
    await wait(600);

    console.log(playerStats, 'playerstattsss =====++++');
    const { game_id, player_id, ...rest } = playerStats;
    try {
        const data = await request({ url: `/api/games/${game_id}/${player_id}`, method: 'POST', session: rest });
        console.log(data, 'data in addPlayerGameStats');
        if (!data) return alert('error in addPlayerGameStats');
        dispatch(addPlayerGameStatsR(data.data));
        dispatch(setIsLoadingR(false));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const quickAddPlayersToGame = ({ players, gameId }) => async (dispatch) => {
    console.log(players, 'players ====== quickAddPlayersToGame ');
    // path: '/api/games/:game_id',
    dispatch(setSingleGameLoadingR());
    // const { game_id, player_id, ...rest } = playerStats;
    try {
        const data = await request({ url: `/api/games/${gameId}`, method: 'PATCH', session: { players } });
        console.log(data, 'data in quickAddPlayersToGame');
        if (!data) return alert('error in quickAddPlayersToGame');
        // dispatch(addPlayerGameStatsR(data.data));
        dispatch(getGameById(gameId));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const removePlayerFromGame = (player) => async (dispatch) => {
    dispatch(setIsLoadingR());
    await wait(600);
    try {
        const data = await request({ url: `/api/games/${player.game_id}/${player.player_id}`, method: 'DELETE', session: player });
        console.log(data, 'data in removePlayerFromGame');
        if (!data) return alert('error in quickAddPlayersToGame');
        dispatch(getGameByIdR(data.data?.game));
        dispatch(setIsLoadingR(false));
        return true;
        // dispatch(getGameById(gameId))
    } catch (err) {
        throw new Error(err);
    }
};
