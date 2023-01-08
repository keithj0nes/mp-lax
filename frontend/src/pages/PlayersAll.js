/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPlayers } from '../redux/slices/playersSlice';
import { Table, Select, Title, Modal } from '../components';

const thisYear = new Date().getFullYear();

// TODO: get this setup with adding a player to another season

const PlayersAll = () => {
    const dispatch = useDispatch();
    const { playersMasterList, playersMasterList2 } = useSelector(state => state.players);

    console.log(playersMasterList2, 'playersMasterList2');
    const initialValue = {
        graduated_already: [],
        elligible: [],
    };

    const groupByCategory = playersMasterList.reduce((group, user) => {
        // const { category } = product;
        const { graduation_year } = user;

        // console.log(thisYear, graduation_year);

        if (thisYear >= (graduation_year + 1)) {
            // console.log('push graduated here');
            // group[graduation_year] = group[graduation_year] || [];
            // group.graduated_already = group.graduated_already || [];
            group.graduated_already.push(user);
        } else {
            // group.more_peeps = group.more_peeps || [];
            group.elligible.push(user);
        }

        // group[graduation_year].push(user);
        return group;
    }, initialValue);

    console.log(groupByCategory, 'groupByCategory')



    const bb = playersMasterList2.map(item => {
        return { ...item, seasons: JSON.parse(item.seasons) };
    })

    console.log(bb, 'bbbbbbb')


    useEffect(() => {
        dispatch(getAllPlayers());
    }, [dispatch]);

    return (
        <main className="py-6">

            <div className="bg-white p-3 mb-6 sm:p-6">
                <div className="justify-between mb-3 sm:flex">
                    <Title>All Players</Title>
                </div>

                <p className="py-4">Elligible Players</p>


                {groupByCategory?.elligible.map(item => {
                    // console.log(item);
                    return (
                        <div className="bg-pink-100 p-4 mb-5">
                            {item.first_name} {item.last_name}
                        </div>
                    );
                })}

                <p className="py-4">Graduated Players</p>

                {groupByCategory?.graduated_already.map(item => {
                    // console.log(item);
                    return (
                        <div className="bg-yellow-100 p-4 mb-5">
                            {item.first_name} {item.last_name}
                        </div>
                    );
                })}
            </div>

        </main>
    );
};

export default PlayersAll;
