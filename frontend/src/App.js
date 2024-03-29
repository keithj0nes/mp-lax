import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import Players from './pages/Players';
import PlayersAll from './pages/PlayersAll';
import Player from './pages/Player';
import Games from './pages/Games';
import Game from './pages/Game';
import Home from './pages/Home';
import { getPlayers } from './redux/slices/playersSlice';
import { getSeasons } from './redux/slices/seasonsSlice';
import { getAllMisc } from './redux/slices/miscSlice';
import { useLongPress } from './hooks';
import useSubDomain from './hooks/useSubDomain';


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPlayers());
        dispatch(getSeasons());
        dispatch(getAllMisc());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Main />}>
                <Route path="/" element={<Home />} />
                <Route path="players" element={<Players />} />
                <Route path="players/all" element={<PlayersAll />} />
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { orgs } = useSelector(state => state.misc);

    const sub = useSubDomain();
    console.log({ sub })
    // const options = [
    //     { value: 'chocolate', label: 'Chocolate' },
    //     { value: 'strawberry', label: 'Strawberry' },
    //     { value: 'vanilla', label: 'Vanilla' },
    // ];

    const colourStyles = {
        // control: styles => ({ ...styles, backgroundColor: 'white', border: 'none' }),
        control: styles => ({ ...styles, border: 'none', visibility: 'hidden' }),
        container: styles => ({ ...styles, zIndex: 500, position: 'absolute', top: 0, minWidth: 180 }),
    };

    const onLongPress = () => {
        console.log('longpress is triggered');
        setIsMenuOpen(!isMenuOpen);
        // setlongPressCount(longPressCount + 1)
    };

    const onClick = () => {
        console.log('click is triggered');
        navigate('/')
        // setClickCount(clickCount + 1)
    };

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };

    const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

    const onSelect = e => {
        console.log(e, 'eee')
        setIsMenuOpen(false);
        window.location.href = `http://${e.slug}.localhost:3000`;
    };

    const options = orgs.map(org => ({ value: org.id, label: org.name, slug: org.slug })).filter(item => item.slug !== sub.slug)

    return (
        <>
            <Helmet>
                <title>MP Boys Lax</title>
            </Helmet>
            <div className="min-h-screen bg-gray-100 px-3 md:px-16" style={{ background: 'rgba(29, 55, 108, 0.05)' }}>
                <div className="max-w-7xl m-auto">
                    <div className="bg-white">
                        <div className="p-3 flex items-center justify-between">
                            {/* header component here */}

                            <Link to="/" className="mr-8 flex items-center">
                                <img src="/images/mp-logo.png" alt="Mt. Pisgah Lacrosse" className="h-10 mr-2" />
                                <h2 className="text-xl text-mpblue font-bold leading-none">BOYS LAX</h2>
                            </Link>

                            {/* Uncommenting this will allow for subdomain links */}
                            {/* <div className="relative">
                                <div className="flex">
                                    <button type="button" {...longPressEvent} className="relative z-[600]  flex items-center">
                                        <img src="/images/mp-logo.png" alt="Mt. Pisgah Lacrosse" className="h-10 mr-2" />
                                        <h2 className="text-xl text-mpblue font-bold leading-none uppercase">{sub?.name}</h2>
                                    </button>
                                    <button type="button" onClick={onLongPress} className=" z-[600]">
                                        <svg className="w-5 h-5 ml-2 text-mpblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>

                                <div className={`${!isMenuOpen && 'opacity-0 pointer-events-none'} fixed inset-0 bg-black bg-opacity-25 z-10 transition-all duration-200`} onClick={() => setIsMenuOpen(!isMenuOpen)} />

                                <Select options={options} isSearchable={false} onChange={onSelect} menuIsOpen={isMenuOpen} styles={colourStyles} />
                            </div> */}


                            {/* <Link to="/">Home</Link> |{" "} */}
                            <div>
                                <Link to="/players">Players</Link>
                                &nbsp; | &nbsp;
                                <Link to="/games">Games</Link>
                                &nbsp; | &nbsp;
                                <Link to="/">Login</Link>
                            </div>
                        </div>
                        <div className="bg-mpblue h-1 w-full" />
                        <div className="bg-mpred h-1 w-full" />
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default App;
