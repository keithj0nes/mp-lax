import { createSlice } from '@reduxjs/toolkit';
import { request } from '../../request';
// import { wait } from '../../helpers';

const initialState = {
    teams: [],
    locations: [],
    orgs: [],
};

export const miscSlice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setIsLoadingR: (state, action) => {
            state.isLoading = action.payload === undefined ? true : action.payload;
        },
        getAllMiscR: (state, action) => {
            state.teams = action.payload.teams;
            state.locations = action.payload.locations;
            state.orgs = action.payload.orgs;
        },
    },
});


// Action creators are generated for each case reducer function
export const { getAllMiscR, setIsLoadingR } = miscSlice.actions;
export default miscSlice.reducer;


export const getAllMisc = () => async (dispatch) => {
    try {
        // const data = await request({ url: `/api/games?${query || ''}`, method: 'GET' });
        const data = await request({ url: '/api/misc', method: 'GET' });
        if (!data) return alert('error in getAlMisc');
        //   const response = await axios.get(`${API_URL}/${data}`);
        dispatch(getAllMiscR(data.data));
        return true;
    } catch (err) {
        throw new Error(err);
    }
};
