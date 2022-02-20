import { useState } from "react";
import { Table , Select, Title } from "../components";

const GAMES = [
    { id: 1, home: true, opponent: 'Sequoia', date: '2/10/22', has_been_played: true, location: '', notes: 'notes about game', goals_for: 9, goals_against: 7, goal_differential: '+2' },
    { id: 2, home: false, opponent: 'Peachtree Ridge', date: '2/13/22', has_been_played: true, location: '', notes: 'notes about game', goals_for: 11, goals_against: 12, goal_differential: -1 },
    { id: 3, home: true, opponent: 'Alpharetta', date: '2/23/22', has_been_played: true, location: '', notes: 'notes about game', goals_for: 19, goals_against: 6, goal_differential: '+13' },
    { id: 4, home: true, opponent: 'Alpharetta', date: '2/25/22', has_been_played: false, location: '', notes: 'notes about game' },
    { id: 5, home: false, opponent: 'Roswell HS', date: '2/30/22', has_been_played: false, location: '', notes: 'notes about game' }

]

const Games = () => {
    const [selectedSeason, setSelectedSeason] = useState({ value: 525, label: '2022 - [current]' });

    const formattedGames = GAMES.map(item => {
        return { 
            ...item,
            opponent: `${item.home ? 'vs' : '@'} ${item.opponent}`,
            goal_differential: `${!item.has_been_played ? 'Not Yet Played' : item.goal_differential}`
        }
    })

    const headers = [
        { label: 'Date', className: 'whitespace-nowrap w-0', default: true },
        // { label: '', className: 'w-0' },
        { label: 'Opponent' },
        { label: 'GF' },
        { label: 'GA' },
        { label: 'Diff' },
    ];

    const columns = {
        date: 'date',
        opponent: {
            type: 'link',
            format: '/games/$id',
            as: '$opponent',
            className: 'whitespace-nowrap',
        },
        goals_for: 'number',
        goals_against: 'number',
        // goal_differential: 'number',
        goal_differential: {
            type: 'number',
            className: 'whitespace-nowrap'
        },

    }

    const optionsExample = [
        { value: 525, label: '2022 - [current]' },
        { value: 5253, label: '2021' },
        { value: 52534, label: '2020' },
        { value: 2352, label: '2019' },
        { value: 3423, label: '2018' },
    ]


    return (
        <main className="py-6">
            <div className="flex justify-end">
                <button
                    // onClick={() => setIsEditing(!isEditing)}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                >
                    Create Game
                </button>
            </div>

            <div className="bg-white p-3 mb-6 sm:p-6">
                <div className="justify-between mb-3 sm:flex">
                    <Title>Games</Title>

                    <div className="flex items-center mb-6 sm:mb-0 ">
                        <p className="text-sm mr-2 mt-1">Season:</p>
                        <div className="w-full sm:w-48">
                            <Select options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                        </div>
                    </div>

                </div>
                <Table
                    headers={headers}
                    columns={columns}
                    body={formattedGames}
                    // title="Games"
                />
            </div>
        </main>
    )
}

export default Games;
