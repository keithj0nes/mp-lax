import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
// import dateFormat from 'date-fns/format';
import { format, parseISO } from 'date-fns';
import { Table, Select, Title, Modal } from '../components';
import { CreateGameModal } from '../components/modals';

import { getAllGames } from '../redux/slices/gamesSlice';
import { MyModal } from '../components/Modal';


const Games = () => {
    const [showCreateGameModal, setShowCreateGameModal] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState({ value: 525, label: '2022 - [current]' });
    const dispatch = useDispatch();
    const { games, isLoading, activeSeason } = useSelector(state => ({ ...state.games, ...state.seasons }));

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    const optionsExample = [
        { value: 525, label: '2022 - [current]' },
        { value: 5253, label: '2021' },
        { value: 52534, label: '2020' },
        { value: 2352, label: '2019' },
        { value: 3423, label: '2018' },
    ];
    // start_date: [d.date, d.start_time] = dateFormat(d.start_date, 'MM/DD/YY h:mmA').split(' ')

    const formattedGames = games.map(item => ({
        ...item,
        opponent: `${item.is_home ? 'vs' : '@'} ${item.name}`,
        goal_differential: (item.goals_for !== null && item.goals_against !== null) && item.goals_for - item.goals_against,
        start_date: format(parseISO(item.start_date), 'M/dd/yy'),
    }));

    const headers = [
        { label: 'Date', className: 'whitespace-nowrap w-0', default: true },
        { label: 'Opponent' },
        { label: 'Result' },
        { label: 'GF' },
        { label: 'GA' },
        { label: 'Diff' },
    ];

    const columns = {
        start_date: 'date',
        opponent: {
            type: 'link',
            format: '/games/$game_id',
            as: '$opponent',
            className: 'whitespace-nowrap',
        },
        result: 'string',
        goals_for: 'number',
        goals_against: 'number',
        goal_differential: 'number',
    };

    return (
        <main className="games-container py-6">

            <Helmet>
                <title>MP Boys Lax | Games</title>
            </Helmet>

            {/* <Modal isOpen={showCreateGameModal} onClose={setShowCreateGameModal} closeableOnBackdrop={!isLoading}> */}
            <Modal isOpen={showCreateGameModal} onClose={setShowCreateGameModal} closeableOnBackdrop={false}>
                {(closeModal) => <CreateGameModal closeModal={closeModal} />}
            </Modal>

            {/* <MyModal isOpen={showCreateGameModal} onClose={setShowCreateGameModal}>
                <p>
                    Hello world
                </p>
            </MyModal> */}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowCreateGameModal(true)}
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
                            <Select disabled options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                        </div>
                    </div>

                </div>
                <Table
                    headers={headers}
                    columns={columns}
                    body={formattedGames}
                    empty="No games have been created for this season"
                />
            </div>
        </main>
    );
};

export default Games;
