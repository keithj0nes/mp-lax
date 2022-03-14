import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from '../../hooks';
import { createSeason } from '../../redux/slices/seasonsSlice';

const initialState = {
    name: '',
};

const validations = {
    name: {
        required: {
            value: true,
            message: 'Season name is required',
        },
    },
};


const CreateSeasonModal = ({ closeModal }) => {
    const { fields, handleChange, errors, validate } = useForm(initialState);
    const dispatch = useDispatch();

    const { createSeasonError } = useSelector(state => state.seasons);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValidated = validate(validations);
        // console.log(isValidated, 'isValidated')
        // console.log(fields, 'fields!!!!!')
        // console.log(errors, 'errors!!!!!')

        // const { season_name } = fields;

        console.log(isValidated, 'is valideateD!');
        const shouldClose = await dispatch(createSeason(fields));
        if (shouldClose) closeModal();
    };

    return (
        <div>
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">Create Season</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    <div className="mb-2">
                        <label htmlFor="season_name" className="text-sm text-gray-800">Season Name</label>
                        <input value={fields.name} onChange={handleChange} type="text" name="name" id="name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${(!!errors.name || createSeasonError) ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.name || createSeasonError}<span className="after:content-['.'] invisible" /></p>
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
                        // onClick={closeModal}
                        type="submit"
                        className="transition duration-300 border border-mpblue text-white py-1 px-3 bg-mpblue hover:text-mpblue hover:bg-transparent"
                    >
                        Create Season
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
