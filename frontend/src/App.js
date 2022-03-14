import React, { useEffect } from 'react';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Players from './pages/Players';
import Player from './pages/Player';
import Games from './pages/Games';
import Game from './pages/Game';
import Home from './pages/Home';
import { getAllPlayers } from './redux/slices/playersSlice';
import { getSeasons } from './redux/slices/seasonsSlice';


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPlayers());
        dispatch(getSeasons());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Main />}>
                <Route path="/" element={<Home />} />
                <Route path="players" element={<Players />} />
                <Route path="players/:player_id" element={<Player />} />
                <Route path="games" element={<Games />} />
                <Route path="games/:game_id" element={<Game />} />
                <Route
                    path="*"
                    element={(
                        <main style={{ padding: '1rem' }}>
                            <p>404 - There is nothing here!</p>
                        </main>
                    )}
                />
            </Route>
        </Routes>
    );
}

function Main() {
    return (
        <div className="min-h-screen bg-gray-100 px-3 md:px-16" style={{ background: 'rgba(29, 55, 108, 0.05)' }}>
            <div className="max-w-7xl m-auto">
                <div className="bg-white">
                    <div className="p-3 flex items-center">
                        {/* header component here */}

                        <Link to="/" className="mr-8 flex items-center">
                            <img src="/images/mp-logo.png" alt="Mt. Pisgah Lacrosse" className="h-10 mr-2" />
                            <h2 className="text-xl text-mpblue font-bold leading-none">BOYS LAX</h2>
                        </Link>

                        {/* <Link to="/">Home</Link> |{" "} */}
                        <Link to="/players">Players</Link>
                        &nbsp; | &nbsp;
                        <Link to="/games">Games</Link>
                    </div>
                    <div className="bg-mpblue h-1 w-full" />
                    <div className="bg-mpred h-1 w-full" />
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default App;
