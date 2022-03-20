import React, { useState } from 'react';
import { ArrowDownIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { Modal } from '../components';
import { CreateSeasonModal, EditSeasonModal } from '../components/modals';

const Home = () => {
    const [showCreateSeasonModal, setShowCreateSeasonModal] = useState(false);
    const [showEditSeasonModal, setShowEditSeasonModal] = useState(false);
    const { isLoading } = useSelector(state => ({ ...state.seasons }));

    return (
        <main className="py-6">
            <Modal isOpen={showCreateSeasonModal} onClose={setShowCreateSeasonModal} closeableOnBackdrop={!isLoading}>
                {(closeModal) => <CreateSeasonModal closeModal={closeModal} />}
            </Modal>

            <Modal isOpen={showEditSeasonModal} onClose={setShowEditSeasonModal} closeableOnBackdrop={!isLoading}>
                {(closeModal) => <EditSeasonModal closeModal={closeModal} />}
            </Modal>

            <div className="flex justify-end mb-4 ">
                <button
                    type="button"
                    // onClick={closeModal}
                    onClick={() => setShowEditSeasonModal(true)}
                    className="transition duration-300 text-sm text-mpblue py-1 px-3 mr-2 hover:underline hover:bg-transparent"
                >
                    View Seasons
                </button>
                <button
                    type="button"
                    onClick={() => setShowCreateSeasonModal(true)}
                    className="transition duration-300 border border-mpblue text-mpblue py-1 px-3  hover:text-white hover:bg-mpblue"
                >
                    Create Season
                </button>
            </div>
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-3xl font-bold">Home Page, what to add?</p>
                <p className="mt-8">
                    <ArrowDownIcon className="inline h-8 mx-1 rotate-180 sm:rotate-135 text-mpred" />
                    Click links at top
                </p>
            </div>
        </main>
    );
};

export default Home;
