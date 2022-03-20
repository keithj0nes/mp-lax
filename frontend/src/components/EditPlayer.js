import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import toRegexRange from 'to-regex-range';
import { useForm } from '../hooks';
import { updatePlayer } from '../redux/slices/playersSlice';

const validFromYear = new Date().getFullYear() - 3;
const validToYear = validFromYear + 6;
const validYearsRegex = toRegexRange(validFromYear, validToYear, { capture: true });

const validations = {
    first_name: {
        required: {
            value: true,
            message: 'First name is required',
        },
    },
    last_name: {
        required: {
            value: true,
            message: 'Last name is required',
        },
    },
    graduation_year: {
        required: {
            value: true,
            message: 'Graduation year is required',
        },
        pattern: {
            value: validYearsRegex,
            message: `Year must be between ${validFromYear} and ${validToYear}`,
        },
    },
};


const EditPlayer = ({ setIsEditing }) => {
    const { player } = useSelector(state => state.players);
    const { fields, handleChange, errors, validate } = useForm(player);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidated = validate(validations);
        if (!isValidated) return;
        dispatch(updatePlayer(fields));
    };
    return (
        <>
            <div className="bg-white p-3 sm:p-6 mb-3 sm:mb-6 shadow-sm">
                <div className="sm:flex sm:gap-5">
                    <div className="mb-2 w-full">
                        <label htmlFor="first_name" className="text-sm text-gray-800">First Name</label>
                        <input value={fields.first_name} onChange={handleChange} type="text" name="first_name" id="first_name" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.first_name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.first_name}<span className="after:content-['.'] invisible" /></p>
                    </div>

                    <div className="mb-2 w-full">
                        <label htmlFor="last_name" className="text-sm text-gray-800">Last Name</label>
                        <input value={fields.last_name} onChange={handleChange} type="text" name="last_name" id="last_name" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.last_name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.last_name}<span className="after:content-['.'] invisible" /></p>
                    </div>
                </div>

                <div className="sm:flex sm:gap-5">
                    <div className="mb-2 w-full">
                        <label htmlFor="player_number" className="text-sm text-gray-800">Player Number - current season</label>
                        <input value={fields.player_number} onChange={handleChange} type="number" name="player_number" id="player_number" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className="pt-0.5 text-xs text-mpred transition duration-300 text-opacity-0">{errors.graduation_year}<span className="after:content-['.'] invisible" /></p>

                    </div>

                    {/* <div className="mb-2 w-full">
                        <label htmlFor="positions" className="text-sm text-gray-800">Positions - separate by comma</label>
                        <input value={fields.positions} onChange={handleChange} type="text" name="positions" id="positions" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                    </div> */}

                    <div className="mb-2 w-full">
                        {/* <label htmlFor="positions" className="text-sm text-gray-800">Positions - separate by comma</label>
                        <input value={fields.positions} onChange={handleChange} type="text" name="positions" id="positions" className="mt-2 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" /> */}

                        <label htmlFor="graduation_year" className="text-sm text-gray-800">Graduation Year</label>
                        <input value={fields.graduation_year} onChange={handleChange} type="number" maxLength={4} name="graduation_year" id="graduation_year" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.graduation_year ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.graduation_year}<span className="after:content-['.'] invisible" /></p>
                    </div>
                </div>
            </div>

            <div className="pb-4 pt-3 flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="transition duration-300 text-mpblue py-1 px-3 mr-5 hover:text-mpblue hover:bg-transparent"
                >
                    Go Back
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                >
                    Save Player
                </button>
            </div>
        </>
    );
};

export default EditPlayer;

EditPlayer.propTypes = {
    setIsEditing: PropTypes.func.isRequired,
};
