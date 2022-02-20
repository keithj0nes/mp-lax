import { Link, Routes, Route, Outlet } from "react-router-dom";
import { ArrowDownIcon } from '@heroicons/react/solid';
import Players from "./pages/Players";
import Player from "./pages/Player";
import Invoices from "./pages/invoices";
import Games from "./pages/Games"
import Game from "./pages/Game";
;

// const GAMES = [
//     { id: 1, home: true, opponent: 'Sequoia', date: new Date(), location: '', notes: 'notes about game' },
//     { id: 2, home: false, opponent: 'Peachtree Ridge', date: new Date(), location: '', notes: 'notes about game' }
// ]


function App() {
    return (
        <Routes>
            <Route path="/" element={<Main />}>
                <Route path="/" element={
                    <main className="flex flex-col items-center justify-center h-96">
                        <p className="text-3xl font-bold">Home Page, what to add?</p>
                        <p className="mt-8">
                        <ArrowDownIcon className="inline h-8 mx-1 rotate-180 sm:rotate-135 text-mpred" 
                    />
                            Click links at top</p>
                    </main>
                } />

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
                            <h2 className="text-xl text-mpblue font-bold">BOYS LAX</h2>
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
