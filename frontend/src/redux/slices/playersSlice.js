import { createSlice } from '@reduxjs/toolkit'
import { request } from '../../request'

const initialState = {
  players: [],
}

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        getPlayersR: (state, action) => {
            state.players = action.payload;
        },
        createPlayerR: (state, action) => {
            state.players = [...state.players, action.payload]
        },
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
    },
})


export const getAllPlayers = () => async (dispatch) => {
    try {
        const data = await request({ url: '/api/players', method: 'GET' });
        // console.log(data, 'daattaaa')
        if (!data) return alert("error in getAllPlayers")
    //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getPlayersR(data.data));
    } catch (err) {
        throw new Error(err);
    }
};

export const createPlayer = (newPlayer) => async (dispatch) => {
    try {
        const data = await request({ url: '/api/players', method: 'POST', session: newPlayer});
        console.log(data, 'data in createPlayer')
        if (!data) return alert("error in createPlayer")

        if (newPlayer.add_to_current_season) {
            dispatch(createPlayerR(data.data));
        }
    } catch (err) {
        throw new Error(err);
    }
};
  

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, getPlayersR, createPlayerR } = playersSlice.actions

export default playersSlice.reducer