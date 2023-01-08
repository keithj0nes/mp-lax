import { createSlice } from '@reduxjs/toolkit';
import { request } from '../../request';

const initialState = {
    playersMasterList: [],
    playersMasterList2: [],

    players: [],
    player: {},
};

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        getPlayersR: (state, action) => {
            state.players = action.payload;
        },
        getAllPlayersR: (state, action) => {
            state.playersMasterList = action.payload;
        },
        getPlayersRR: (state, action) => {
            console.log(action, 'actionnn')
            state.playersMasterList2 = action.payload;
        },
        getPlayerR: (state, action) => {
            state.player = action.payload;
        },
        createPlayerR: (state, action) => {
            state.players = [...state.players, action.payload];
        },
        clearPlayerByIdR: (state) => {
            state.player = {};
        },
        updatePlayerR: (state, action) => {
            state.player = { ...state.player, ...action.payload };
        },
    },
});

// Action creators are generated for each case reducer function
export const { getPlayersR, getAllPlayersR, getPlayerR, createPlayerR, clearPlayerByIdR, updatePlayerR, getPlayersRR } = playersSlice.actions;
export default playersSlice.reducer;


export const getPlayers = () => async (dispatch) => {
    try {
        const data = await request({ url: '/api/players', method: 'GET' });
        // console.log(data, 'daattaaa')
        if (!data) return alert('error in getPlayers');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getPlayersR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const getAllPlayers = () => async (dispatch) => {
    try {
        const data = await request({ url: '/api/players-all', method: 'GET' });
        // console.log(data, 'daattaaa')
        if (!data) return alert('error in getAllPlayers');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getAllPlayersR(data.data));






        

        // TODO: players-all should return data as data.data and not newQuery








        dispatch(getPlayersRR(data.newQuery));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const getPlayerById = (player_id) => async (dispatch) => {
    // console.log(player_id, 'player id')
    try {
        const data = await request({ url: `/api/players/${player_id}`, method: 'GET' });
        // console.log(data, 'daattaaa')
        if (!data) return alert('error in getPlayerById');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getPlayerR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const createPlayer = (newPlayer) => async (dispatch) => {
    try {
        const data = await request({ url: '/api/players', method: 'POST', session: newPlayer });
        console.log(data, 'data in createPlayer');
        if (!data) return alert('error in createPlayer');

        if (newPlayer.add_to_current_season) {
            dispatch(createPlayerR(data.data));
        }
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const updatePlayer = (player) => async (dispatch) => {
    const { player_id } = player;
    // console.log(player, 'player')

    try {
        const data = await request({ url: `/api/players/${player_id}`, method: 'PUT', session: player });
        console.log(data, 'data in updatePlayer');
        if (!data) return alert('error in updatePlayer');
        dispatch(updatePlayerR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};
