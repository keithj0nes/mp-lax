import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from '../../hooks';

const validations = {
    name: {
        required: {
            value: true,
            message: 'Season name is required',
        },
    },
};

const EditSeasonModal = ({ closeModal }) => {
    // const [state, setState] = useState(null);
    const { seasons } = useSelector(state => ({ ...state.seasons }));
    const [isEditing, setIsEditing] = useState(false);
    const [selected, setSelected] = useState({});
    const { fields, handleChange, errors, validate } = useForm(selected);

    console.log(seasons, ' seasons');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(fields,' fieldssss')
        const isValidated = validate(validations);
        console.log(isValidated,' iss itt??')
    }

    return (
        <div className={!isEditing ? 'w-60' : ''}>
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">{isEditing ? 'Edit Season' : 'Seasons'}</h3>
            </div>
            <div>

                <div className="">

                    {!isEditing && seasons.map(season => (
                        <div key={season.id} className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                            <div>
                                <h3>{season.name}</h3>
                                <p className="text-sm">{season.is_active ? <span className="text-green-400">Active</span> : <span className="text-red-400">Not active</span> }</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(true);
                                    setSelected(season);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    ))}

                    {isEditing && (
                        <form onSubmit={handleSubmit}>
                            <div className="p-4">
                                <div className="mb-2">
                                    <label htmlFor="name" className="text-sm text-gray-800">Season Name</label>
                                    <input value={fields.name} onChange={handleChange} type="text" name="name" id="name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                                    <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.name}<span className="after:content-['.'] invisible" /></p>
                                </div>

                                <label className="inline-flex items-center">
                                    <input
                                        name="is_active"
                                        checked={fields.is_active}
                                        disabled={selected.is_active}
                                        type="checkbox"
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Set to active season</span>
                                </label>
                                {selected.is_active && (
                                    <p className="text-sm text-gray-700 leading-none pt-2">* Set different season to active in <br /> <span className="ml-3">order to deactivate this season</span></p>
                                )}
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
                                    Update Season
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditSeasonModal;

EditSeasonModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
};
