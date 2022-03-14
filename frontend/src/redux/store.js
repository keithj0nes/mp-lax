import { configureStore } from '@reduxjs/toolkit';
import players from './slices/playersSlice';
import games from './slices/gamesSlice';
import seasons from './slices/seasonsSlice';

export default configureStore({
    reducer: {
        players,
        games,
        seasons,
    },
});
