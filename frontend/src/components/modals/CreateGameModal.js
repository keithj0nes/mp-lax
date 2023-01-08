// import toRegexRange from 'to-regex-range';
import React from 'react';
import PropTypes from 'prop-types';
// import DateTimePicker from 'react-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Switch } from '@headlessui/react';
import { useForm } from '../../hooks';
import { createGame } from '../../redux/slices/gamesSlice';
import { Loader } from '..';

const initialState = {
    start_date: new Date().toLocaleString(),
    // start_date: new Date(),
    is_home: false,
    location_id: '',
    opponent_id: '',
};

const validations = {
    opponent_id: {
        required: {
            value: true,
            message: 'Opponent is required',
        },
    },
    location_id: {
        required: {
            value: true,
            message: 'Location is required',
        },
    },
    start_date: {
        required: {
            value: true,
            message: 'Start date is required',
        },
        // pattern: {
        //     value: /(\d{4})-(\d{2})-(\d{2})( (\d{2}):(\d{2}):(\d{2}))?/,
        //     // message: 'Start time must match format 2008-09-01 12:35:45'
        //     message: 'Start time must match format YYYY-DD-MM HH:MM:SS'
        // }
    },
    // is_home: {
    //     required: {
    //         value: true,
    //         message: 'Graduation year is required',
    //     },
    //     // pattern: {
    //     //     value: validYearsRegex,
    //     //     message: `Year must be between ${validFromYear} and ${validToYear}`,
    //     // },
    // }
};

const CreateGameModal = ({ closeModal }) => {
    const { fields, handleChange, errors, validate } = useForm(initialState);
    const { isLoading } = useSelector(state => state.games);
    const { teams, locations } = useSelector(state => state.misc);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValidated = validate(validations);
        // console.log(isValidated, 'isValidated')
        // console.log(fields, 'fields!!!!!')
        // console.log(errors, 'errors!!!!!')

        console.log(fields, 'fields');
        if (!isValidated) return;

        const shouldClose = await dispatch(createGame(fields));
        if (!!shouldClose) {
            closeModal();
        }
    };

    const formatOptionLabel = ({ label, address }) => (
        <div>
            <p>{label}</p>
            <p className="text-gray-400 text-xs">{address}</p>
        </div>
    );


    const formattedLocations = locations.map(loc => ({ label: loc.name, value: loc.id, address: loc.address }));
    // formattedLocations.filter((option) => option.id == fields.location_id)[0]
    const formattedTeams = teams.map(team => ({ label: team.name, value: team.id }));

    return (
        <div className="bg-red-10">
            <Loader loading={isLoading} />
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">Create Game</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    {/* <div className="mb-2">
                        <label className="text-sm text-gray-800">Season</label>
                        <Select options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                    </div> */}

                    {/* should be a select dropdown */}
                    {/* <div className="mb-1">
                        <label htmlFor="opponent" className="text-sm text-gray-800">Opponent</label>
                        <input value={fields.opponent} onChange={handleChange} type="text" name="opponent" id="opponent" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.opponent ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.opponent}<span className="after:content-['.'] invisible" /></p>
                    </div> */}

                    <div className="mb-1">
                        <label htmlFor="opponent" className="text-sm text-gray-800">Opponent</label>
                        {/* <input value={fields.location} onChange={handleChange} type="text" name="location" id="location" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}
                        <Select
                            options={formattedTeams}
                            onChange={e => handleChange(null, e.value, 'opponent_id')}
                            // formatOptionLabel={formatOptionLabelTeams}
                            value={formattedTeams.filter((option) => option.value === parseInt(fields.opponent_id))[0]}
                        />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.opponent_id ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.opponent_id}<span className="after:content-['.'] invisible" /></p>
                    </div>

                    {/* <div className="mb-1">
                        <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        <input value={fields.location} onChange={handleChange} type="text" name="location" id="location" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.location ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.location}<span className="after:content-['.'] invisible" /></p>
                    </div> */}

                    {/* <Select options={locations.map(loc => ({ label: loc.name, value: loc.id }))} onChange={e => console.log(e)} value={fields.location2} /> */}


                    <div className="mb-1">
                        <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        {/* <input value={fields.location} onChange={handleChange} type="text" name="location" id="location" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}
                        <Select
                            options={formattedLocations}
                            onChange={e => handleChange(null, e.value, 'location_id')}
                            formatOptionLabel={formatOptionLabel}
                            value={formattedLocations.filter((option) => option.value === parseInt(fields.location_id))[0]}
                        />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.location_id ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.location_id}<span className="after:content-['.'] invisible" /></p>
                    </div>

                    {/* <DateTimePicker onChange={e => handleChange(null, e, 'start_date')} value={fields.start_date} /> */}

                    <div className="mb-1">
                        <label htmlFor="start_date" className="text-sm text-gray-800">Start Date</label>
                        <input value={fields.start_date} onChange={handleChange} type="text" name="start_date" id="start_date" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.start_date ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.start_date}<span className="after:content-['.'] invisible" /></p>
                    </div>

                    {/* <div className="mb-1">
                        <div className="flex">
                            <input checked={fields.is_home} onChange={handleChange} type="checkbox" maxLength={4} name="is_home" id="is_home" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                            <label htmlFor="is_home" className="pl-3  text-sm text-gray-800">Home Game?</label>
                        </div>
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.is_home ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.is_home}<span className="after:content-['.'] invisible" /></p>
                    </div> */}


                    <div className="mb-1">
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch
                                    checked={fields.is_home}
                                    onChange={e => handleChange(null, !!e, 'is_home')}
                                    className={`${fields.is_home ? 'bg-mpred' : 'bg-gray-300'} relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span className="sr-only">Home Game?</span>
                                    <span
                                        aria-hidden="true"
                                        className={`${fields.is_home ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                                <Switch.Label className="ml-3 text-sm text-gray-800">Home Game?</Switch.Label>
                            </div>
                        </Switch.Group>

                    </div>
                </div>
                <div className="px-4 pb-4 pt-3 border-t border-gray-300 flex justify-end">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="transition duration-300 text-mpred py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                    >
                        Create Game
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateGameModal;

CreateGameModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
};
