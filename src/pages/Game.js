import { Table, Title } from "../components";


const GAME = {
    opponent: 'Alpharetta HS',
    opponent_id: 2432,
    location: '1234 10th st, Alpharetta',
    date: 'February 18th, 2022',
    scores: {
        us: [2, 4, 3, 7, 16],
        opponent: [2, 2, 5, 2, 11],
    },
    team_stats: {
        goals: { us: 16, opponent: 11 },
        ground_balls: { us: 10, opponent: 16 },
        shots: { us: 24, opponent: 22 },
        faceoffs_won: { us: 20, opponent: 11 },
        penalties_in_minutes: { us: 2.5, opponent: 5 }
    },
    player_stats: [
        { id: 1, first_name: 'John', last_name: 'Hicks', number: 22, graduation_year: 2024, goals: 3, assists: 1, points: 4 },
        { id: 2, first_name: 'Aiden', last_name: 'Carlock', number: 24, graduation_year: 2024, goals: 3, assists: 2, points: 5 },
        { id: 3, first_name: 'Jack', last_name: 'Cendoya', number: 55, graduation_year: 2022, goals: 1, assists: 0, points: 1 },
    ],
    goalie_stats: [
        { id: 12, first_name: 'Matthew', last_name: 'Davidson', number: 5, graduation_year: 2022, minutes: 48, shots_on_goal: 22, saves: 11, save_percentage: 0.5, goals_against: 11, goals_against_percentage: 0.5 },
        // { id: 24, first_name: 'Aiden', last_name: 'Carlock', number: 24, graduation_year: 2024, goals: 3, assists: 2, points: 5 },
    ]
}


// save percentage calc = saves / shots on goal
const Game = () => {
    const { opponent, location, date, scores, team_stats, player_stats, goalie_stats } = GAME;

    const playerHeaders = [
        { label: '#', sort: 'number', className: 'whitespace-nowrap w-0', default: true },
        { label: 'Player', sort: 'last_name', className: 'whitespace-nowrap' },
        { label: 'G', sort: 'goals' },
        { label: 'A', sort: 'assists' },
        { label: 'PTS', sort: 'points' },
    ];



    const playerColumns = {
        number: 'number',
        name: {
            type: 'link',
            format: '/players/$id',
            as: '$first_name $last_name',
            className: 'whitespace-nowrap'
        },
        goals: 'number',
        assists: 'number',
        points: 'number',
    }


    const goalieHeaders = [
        { label: '#', className: 'whitespace-nowrap w-0', default: true },
        { label: 'Player', className: 'whitespace-nowrap' },
        { label: 'SOG' },
        { label: 'SV' },
        { label: 'SV%' },
        { label: 'GA' },
        { label: 'GA%' },
        { label: 'Min' },

    ];

    const goalieColumns = {
        number: 'number',
        name: {
            type: 'link',
            format: '/players/$id',
            as: '$first_name $last_name',
            className: 'whitespace-nowrap'
        },
        shots_on_goal: 'number',
        saves: 'number',
        save_percentage: 'number',
        goals_against: 'number',
        goals_against_percentage: 'number',
        minutes: 'number',
    }



    return (
        <main className="py-6">

            <div className="flex justify-end">
                <button
                    // onClick={() => setIsEditing(!isEditing)}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                >
                    Edit Game
                </button>
            </div>

            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 sm:flex flex-wrap items-center justify-between shadow-sm">

                <div className="pb-6 md:pb-0 text-center">
                    <h3 className="text-3xl">{opponent}</h3>
                    <h4 className="text-sm">{location}</h4>
                    <h4 className="text-sm">{date}</h4>
                </div>

                <div className="overflow-scroll">
                    <table className="m-auto md:m-0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>Final</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="pr-4 border-b border-gray-200 whitespace-nowrap">Patriots</td>
                                {scores.us.map((score, ind) => {
                                    return <td key={ind} className="px-3 md:px-6 py-1 border border-gray-200">{score}</td>
                                })}
                            </tr>
                            <tr>
                                <td className="pr-4 whitespace-nowrap">{opponent}</td>
                                {scores.opponent.map((score, ind) => {
                                    return <td key={ind} className="px-3 md:px-6 py-1 border border-gray-200">{score}</td>
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                <Title>Team Stats</Title>
                <table className="">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="pb-1 text-xs font-normal">G</th>
                            <th className="pb-1 text-xs font-normal">GB</th>
                            <th className="pb-1 text-xs font-normal">SH</th>
                            <th className="pb-1 text-xs font-normal">FO</th>
                            <th className="pb-1 text-xs font-normal">PIM</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b border-mpred">
                            <td className="md:pr-4 whitespace-nowrap w-full border-r border-mpred md:w-auto">Patriots</td>
                            {Object.keys(team_stats).map(item => {
                                return <td key={item} className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{team_stats[item].us}</td>
                            })}
                        </tr>
                        <tr>
                            <td className="pr-1 md:pr-4 whitespace-nowrap w-full border-r border-mpred md:w-auto">{opponent}</td>
                            {Object.keys(team_stats).map(item => {
                                return <td key={item} className="px-2 py-1 text-lg font-bold text-mpblue sm:px-6 sm:text-3xl">{team_stats[item].opponent}</td>
                            })}
                        </tr>
                    </tbody>
                </table>

            </div> 

            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                <Table
                    headers={playerHeaders}
                    columns={playerColumns}
                    body={player_stats}
                    title="Player Stats"
                />
            </div>

            <div className="bg-white p-3 sm:p-6 mb-6 shadow-sm overflow-scroll">
                <Table
                    headers={goalieHeaders}
                    columns={goalieColumns}
                    body={goalie_stats}
                    title="Goalie Stats"
                />
            </div>

        </main>
    )
}

export default Game;




// TODO: figure out for mobile later
// <table className="m-auto md:m-0">
//     <thead>
//         <tr>
//             <th className="pr-4 border-b border-gray-200 whitespace-nowrap"></th>
//             <th className="pr-4 border-b border-gray-200 whitespace-nowrap">Patriots</th>
//             <th className="pr-4 border-b border-gray-200 whitespace-nowrap">{opponent}</th>
//         </tr>
//     </thead>
//     <tbody>
//         <tr>
//             <td className="pr-4 whitespace-nowrap">1</td>
//         </tr>
//         <tr>
//             <td className="pr-4 whitespace-nowrap">2</td>
//         </tr>
//         <tr>
//             <td className="pr-4 whitespace-nowrap">3</td>
//         </tr>
//         <tr>
//             <td className="pr-4 whitespace-nowrap">4</td>
//         </tr>
//     </tbody>
// </table>