import { createSlice } from '@reduxjs/toolkit';
import { request } from '../../request';

const initialState = {
    seasons: [],
    activeSeason: {},
    createSeasonError: '',
};

export const seasonsSlice = createSlice({
    name: 'seasons',
    initialState,
    reducers: {
        getSeasonsR: (state, action) => {
            state.seasons = action.payload.seasonsLookup;
            state.activeSeason = action.payload.activeSeason || {};
        },
        createSeasonR: (state, action) => {
            if (typeof action.payload === 'string') {
                state.createSeasonError = action.payload;
            } else {
                state.seasons = [...state.seasons, action.payload];
                state.createSeasonError = '';
            }
        },
    },
});

export const { getSeasonsR, createSeasonR } = seasonsSlice.actions;
export default seasonsSlice.reducer;

export const getSeasons = () => async (dispatch) => {
    try {
        const data = await request({ url: '/api/seasons', method: 'GET' });
        if (!data) return alert('error in getSeasons');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getSeasonsR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const createSeason = (season) => async (dispatch) => {
    try {
        const data = await request({ url: '/api/seasons', method: 'POST', session: { name: season.name } });
        if (data.status !== 200) {
            dispatch(createSeasonR(data.message));
            return false;
        }
        if (!data) return alert('error in createSeason');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(createSeasonR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};
