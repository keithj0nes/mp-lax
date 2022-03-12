import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
// import classnames from 'classnames';
import { Table , Select, Title, Modal } from "../components";
import { CreatePlayerModal } from "../components/modals";
import { getAllPlayers } from "../redux/slices/playersSlice";

const PLAYERS = [
    { id: 1, first_name: 'John', last_name: 'Hicks', number: 22, graduation_year: 2024, games_played: 4, goals: 19, goals_per_game: 4.75, assists: 4, assists_per_game: 1, points: 23, points_per_game: 5.8 },
    { id: 2, first_name: 'Aiden', last_name: 'Carlock', number: 24, graduation_year: 2024, games_played: 6, goals: 9, goals_per_game: 1.5, assists: 1, assists_per_game: 0.1, points: 10, points_per_game: 1.6 },
    { id: 23, first_name: 'Jack', last_name: 'Cendoya', number: 55, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
    { id: 43, first_name: 'Scott', last_name: 'Common', number: 23, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
    { id: 53, first_name: 'Oscar', last_name: 'Jackson', number: 53, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
    { id: 35, first_name: 'Adam', last_name: 'Wold', number: 51, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
    { id: 335, first_name: 'Kris', last_name: 'Johnson', number: 19, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
    { id: 223, first_name: 'Larkin', last_name: 'Gray', number: 5, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
    { id: 13, first_name: 'Martin', last_name: 'Santana', number: 2, graduation_year: 2022, games_played: 6, goals: 1, goals_per_game: 0.1, assists: 0, assists_per_game: 0, points: 1, points_per_game: 0.1 },
]

export default function Players() {
    const [selectedSeason, setSelectedSeason] = useState({ value: 525, label: '2022 - [current]' });
    const [showCreatePlayerModal, setShowCreatePlayerModal] = useState(false);
    const params = useParams();
    // console.log(params, 'param')

    // const count = useSelector((state) => {
    //     console.log(state,' STAATTTE')
    //     return state
    //     // return state.counter?.value
    // })
    const dispatch = useDispatch();


    const { players } = useSelector(state => state.players)

    // console.log(players,' LMAO ========')

    useEffect(() => {
        dispatch(getAllPlayers());
    }, [dispatch])

    // console.log(count,' COUNTTT')


    // const count = useSelector((state) => state.counter.value)

    // console.log(count, dispatch, 'coutn dispathggchh')

    const headers = [
        { label: '#', sort: 'number', className: 'whitespace-nowrap', alt: 'Jersey', default: true },
        { label: 'Player', sort: 'last_name', className: 'whitespace-nowrap', alt: 'Player' },
        { label: 'GP', sort: 'games_played', alt: 'Games Played' },
        { label: 'G', sort: 'goals', alt: 'Goals' },
        { label: 'G/G', sort: 'goals_per_game', alt: 'Goals Per Game' },
        { label: 'A', sort: 'assists', alt: 'Assists' },
        { label: 'A/G', sort: 'assists_per_game', alt: 'Assists Per Game' },
        { label: 'PTS', sort: 'points', alt: 'Points' },
        { label: 'P/G', sort: 'points_per_game', alt: 'Points Per Game' },
    ];

    const columns = {
        number: 'number',
        name: {
            type: 'link',
            format: '/players/$id',
            as: '$first_name $last_name',
            // as: 'View Details',
            className: 'whitespace-nowrap'
        },
        games_played: 'number',
        goals: 'number',
        goals_per_game: 'number',
        assists: 'number',
        assists_per_game: 'number',
        points: 'number',
        points_per_game: 'number',

        // email: 'string',
        // amount: 'currency',
        // subscription: {
        //     type: 'boolean',
        //     format: <svg className="transition duration-200 opacity-1 w-4 h-4 text-purple pointer-events-none" viewBox="0 0 172 172"><g fill="none" strokeWidth="none" strokeMiterlimit="10" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode:'normal'}}><path d="M0 172V0h172v172z"/><path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" strokeWidth="1"/></g></svg>,
        //     className: 'justify-center flex',
        // },
    }

    const optionsExample = [
        { value: 525, label: '2022 - [current]' },
        { value: 5253, label: '2021' },
        { value: 52534, label: '2020' },
        { value: 2352, label: '2019' },
        { value: 3423, label: '2018' },
    ]

    const headers2 = [
        // { label: '#', sort: 'player_id', className: 'whitespace-nowrap', alt: 'Jersey', default: true },
        // { label: 'Player', sort: 'first_name', className: 'whitespace-nowrap', alt: 'Player', default: true },
        // { label: 'GP', sort: 'games_played', alt: 'Games Played' },
        // { label: 'G', sort: 'goals', alt: 'Goals' },
        // { label: 'G/G', sort: 'goals_per_game', alt: 'Goals Per Game' },
        // { label: 'A', sort: 'assists', alt: 'Assists' },
        // { label: 'A/G', sort: 'assists_per_game', alt: 'Assists Per Game' },
        // { label: 'PTS', sort: 'points', alt: 'Points' },
        // { label: 'P/G', sort: 'points_per_game', alt: 'Points Per Game' },

        { label: '#', sort: 'player_number', className: 'whitespace-nowrap', alt: 'Jersey', default: true  },
        { label: 'Player', sort: 'last_name', className: 'whitespace-nowrap', alt: 'Player' },
        { label: 'GP', sort: 'games_played', alt: 'Games Played' },
        { label: 'G', sort: 'goals', alt: 'Goals' },
        { label: 'G/G', sort: 'goals_per_game', alt: 'Goals Per Game' },
        { label: 'A', sort: 'assists', alt: 'Assists' },
        { label: 'A/G', sort: 'assists_per_game', alt: 'Assists Per Game' },
        { label: 'PTS', sort: 'points', alt: 'Points' },
        { label: 'P/G', sort: 'points_per_game', alt: 'Points Per Game' },
    ];

    const columns2 = {
        player_number: 'number',
        // first_name: 'string',
        // number: 'number',
        name: {
            type: 'link',
            format: '/players/$player_id',
            as: '$first_name $last_name',
            // as: 'View Details',
            className: 'whitespace-nowrap'
        },
        games_played: 'number',
        goals: 'number',
        goals_per_game: 'number',
        assists: 'number',
        assists_per_game: 'number',
        points: 'number',
        points_per_game: 'number',
    }
// console.log(PLAYERS, 'PLAYERS')

    return (
        <main className="py-6">

            <Modal isOpen={showCreatePlayerModal} onClose={setShowCreatePlayerModal}>
                {(closeModal) => <CreatePlayerModal closeModal={closeModal} />}
            </Modal>

            <div className="flex justify-end">
                <button
                    onClick={() => setShowCreatePlayerModal(true)}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3 mb-4  hover:text-white hover:bg-mpblue"
                >
                    Create Player
                </button>
            </div>

            {/* <div className="bg-white p-3 mb-6 sm:p-6">
                <div className="justify-between mb-3 sm:flex">
                    <Title>Players</Title>

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
                    body={PLAYERS}
                />
            </div> */}

            <div className="bg-white p-3 mb-6 sm:p-6">
                <div className="justify-between mb-3 sm:flex">
                    <Title>Players</Title>

                    <div className="flex items-center mb-6 sm:mb-0 ">
                        <p className="text-sm mr-2 mt-1">Season:</p>
                        <div className="w-full sm:w-48">
                            <Select disabled options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                        </div>
                    </div>

                </div>

                <Table
                    headers={headers2}
                    columns={columns2}
                    body={players || []}
                    uniqueKey="player_id"
                />
            </div>

        </main>
    );
}

