// import toRegexRange from 'to-regex-range';
import React from 'react';
import PropTypes from 'prop-types';

// import { customAlphabet } from 'nanoid'
import { useForm } from '../../hooks';

const initialState = {
    season_name: '',
};

const validations = {
    season_name: {
        required: {
            value: true,
            message: 'Season name is required',
        },
    },
};


const CreateSeasonModal = ({ closeModal }) => {
    const { fields, handleChange, errors, validate } = useForm(initialState);


    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidated = validate(validations);
        // console.log(isValidated, 'isValidated')
        // console.log(fields, 'fields!!!!!')
        // console.log(errors, 'errors!!!!!')

        // const { season_name } = fields;

        console.log(isValidated, 'is valideateD!');
        // TODO: create ednpoint
        // is_active: false,
        // created_at: new Date(),
    };

    return (
        <div>
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">Create Season</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    {/* <div className="mb-2">
                        <label className="text-sm text-gray-800">Season</label>
                        <Select options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                    </div> */}

                    <div className="mb-2">
                        <label htmlFor="season_name" className="text-sm text-gray-800">Season Name</label>
                        <input value={fields.season_name} onChange={handleChange} type="text" name="season_name" id="season_name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.season_name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.season_name}<span className="after:content-['.'] invisible" /></p>
                    </div>

                    {/* <div className="mb-2">
                        <label htmlFor="last_name" className="text-sm text-gray-800">Last Name</label>
                        <input value={fields.last_name} onChange={handleChange} type="text" name="last_name" id="last_name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.last_name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.last_name}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="graduation_year" className="text-sm text-gray-800">Graduation Year</label>
                        <input value={fields.graduation_year} onChange={handleChange} type="number" maxLength={4} name="graduation_year" id="last_name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.graduation_year ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.graduation_year}<span className="after:content-['.'] invisible"></span></p>
                    </div> */}
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
                        // onClick={closeModal}
                        type="submit"
                        className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                    >
                        Create Player
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSeasonModal;

CreateSeasonModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
};
