import { configureStore } from '@reduxjs/toolkit';
import players from './slices/playersSlice';
import games from './slices/gamesSlice';
import seasons from './slices/seasonsSlice';
import misc from './slices/miscSlice';

export default configureStore({
    reducer: {
        players,
        games,
        seasons,
        misc,
    },
});
