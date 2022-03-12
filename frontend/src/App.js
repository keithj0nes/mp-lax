import { useEffect } from "react";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import Players from "./pages/Players";
import Player from "./pages/Player";
import Invoices from "./pages/invoices";
import Games from "./pages/Games"
import Game from "./pages/Game";
import Home from './pages/Home';
import './firebase';
import { getAllPlayers } from "./redux/slices/playersSlice";

// import { request } from "./request";

// import { getDatabase, ref, onValue} from "firebase/database";



// const GAMES = [
//     { id: 1, home: true, opponent: 'Sequoia', date: new Date(), location: '', notes: 'notes about game' },
//     { id: 2, home: false, opponent: 'Peachtree Ridge', date: new Date(), location: '', notes: 'notes about game' }
// ]


function App() {
    const dispatch = useDispatch();


    useEffect(() => {
        console.log('getting all players')
        dispatch(getAllPlayers());
    }, [dispatch])

    // useEffect(() => {
    //     console.log('fire da stuff')
    //     request({ method: 'GET', url: '/api/seasons/'})
    // }, [])

    // console.log(process.env, 'process nvv')

    // const db = getDatabase();
    // // console.log(db,' dbbbb')
    // const starCountRef = ref(db);
    // console.log(starCountRef, 'starcoutn')
    // onValue(starCountRef, (snapshot) => {
    //     const data = snapshot.val();
    //     console.log(data, 'data')
    //     // updateStarCount(postElement, data);
    // });

    // user example
    const playersObjectExample = {
        265272: {
            first_name: "jerry",
            graduation_year: 2023,
            last_name: "jokes",
            seasons: {
                'spring-2021': true,
                'spring-2022': true,
            }
        }
    }

    const seasonsObjectExample = {
        'spring-2021': {
            is_active: true,
            players: {
                265272: true,
            },
            games: {
                GAME_ID: true,
                GAME_ID1: true,
            }
        },
        'spring-2022': {
            is_active: false,
            players: {
                265272: true,
                236355: true,
            }
        }
    }

    const statsObjectExample = {
        'spring-2021': {

        }
    }

    // DONE
    const seasonPlayerStatsObjectExample = {
        'spring-2021': {
            265272: { number: 22, games_played: 4, goals: 19, goals_per_game: 4.75, assists: 4, assists_per_game: 1, points: 23, points_per_game: 5.8 },
            236355: { number: 24, games_played: 6, goals: 9, goals_per_game: 1.5, assists: 1, assists_per_game: 0.1, points: 10, points_per_game: 1.6 },
        },
        'spring-2022': {
            265272: { number: 22, games_played: 10, goals: 16, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
            236355: { number: 24, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1  },
        }
    }

    const seasonTeamStatsObjectExample = {
        'spring-2021': {
            games_played: 18,
            wins: 12,
            losses: 6,
            ties: 0,
            overtimes_played: 0,
            goals_for: 178,
            goals_against: 152
        }
    }

    const gameObjectExample = {
        'GAME_ID': {
            season_id: 'spring-2022',
            opponent: 'Alpharetta HS',
            opponent_id: 2432,
            location: '1234 10th st, Alpharetta',
            location_id: 28020,
            date: 'February 18th, 2022',
            scores: {
                us: [2, 4, 3, 7, 16],
                opponent: [2, 2, 5, 2, 11],
                // 1: { us: 2, opponent: 2 },
                // 2: { us: 4, opponent: 2 },
                // 3: { us: 3, opponent: 5 },
                // 4: { us: 7, opponent: 2 },
                // f: { us: 16, opponent: 11 },
            },
            team_stats: {
                goals: { us: 16, opponent: 11 },
                ground_balls: { us: 10, opponent: 16 },
                shots: { us: 24, opponent: 22 },
                faceoffs_won: { us: 20, opponent: 11 },
                penalties_in_minutes: { us: 2.5, opponent: 5 }
            },
        }
    }

    return (
        <Routes>
            <Route path="/" element={<Main />}>
                <Route path="/" element={<Home />} />

                <Route path="players" element={<Players />} />
                <Route path="players/:player_id" element={<Player />} />
                <Route path="games" element={<Games />} />
                <Route path="games/:game_id" element={<Game />} />
                <Route path="invoices" element={<Invoices />} />
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                        <p>404 - There's nothing here!</p>
                        </main>
                    }
                />
            </Route>
        </Routes>
    )
}

function Main() {
    return (
        <div className="min-h-screen bg-gray-100 px-3 md:px-16" style={{background: 'rgba(29, 55, 108, 0.05)'}}>

            <div className="max-w-7xl m-auto">

                <div className="bg-white" >

                    <div className="p-3 flex items-center" >
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
                    <div className="bg-mpblue h-1 w-full"></div>
                    <div className="bg-mpred h-1 w-full"></div>
                </div>


                <Outlet />

                {/* <div className="flex">
                    {GAMES.map(item => {
                        return (
                            <div className="p-4 bg-white mx-2">
                                <h3 className="text-center">
                                    {item.home ? 'VS' : 'AT'}
                                    <br /> 
                                    {item.opponent}
                                </h3>

                            </div>
                        )
                    })}
                </div> */}
            </div>

        </div>
    );
}

export default App;
