import { configureStore } from '@reduxjs/toolkit';
import players from './slices/playersSlice';
import games from './slices/gamesSlice';

export default configureStore({
    reducer: {
        players,
        games,
    },
});
