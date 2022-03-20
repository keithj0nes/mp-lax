import { createSlice } from '@reduxjs/toolkit';
import { request } from '../../request';
import { wait } from '../../helpers';

const initialState = {
    seasons: [],
    activeSeason: {},
    createSeasonError: '',
    isLoading: false,
};

export const seasonsSlice = createSlice({
    name: 'seasons',
    initialState,
    reducers: {
        setIsLoadingR: (state, action) => {
            state.isLoading = action.payload === undefined ? true : action.payload;
        },
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
        updateSeasonR: (state, action) => {
            const seasons = state.seasons.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload;
                }
                return { ...item, is_active: false };
            });

            state.seasons = seasons;
            state.activeSeason = action.payload;
        },
    },
});

export const { getSeasonsR, createSeasonR, setIsLoadingR, updateSeasonR } = seasonsSlice.actions;
export default seasonsSlice.reducer;

export const getSeasons = () => async (dispatch) => {
    try {
        const data = await request({ url: '/api/seasons', method: 'GET' });
        if (!data) return alert('error in getSeasons');
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
        dispatch(createSeasonR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export const updateSeason = (season) => async (dispatch) => {
    dispatch(setIsLoadingR());
    await wait(400);
    try {
        const data = await request({ url: `/api/seasons/${season.id}`, method: 'PUT', session: season });
        console.log(data, 'daattaaa');
        if (!data) return alert('error in updateSeason');
        dispatch(updateSeasonR(data.data));
        dispatch(setIsLoadingR(false));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};
