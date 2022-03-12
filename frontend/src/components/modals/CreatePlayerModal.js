import toRegexRange from 'to-regex-range';
// import { getDatabase, ref, set } from "firebase/database";
import { useDispatch } from 'react-redux'
// import { customAlphabet } from 'nanoid'
import { useForm } from "../../hooks";
// import { request } from '../../request';
import { createPlayer } from '../../redux/slices/playersSlice';

const validFromYear = new Date().getFullYear() - 3;
const validToYear = validFromYear + 6;
const validYearsRegex = toRegexRange(validFromYear, validToYear, { capture: true });

const initialState = {
    first_name: '',
    last_name: '',
    graduation_year: '',
    add_to_current_season: true,
}

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
    }
}

const CreatePlayerModal = ({ closeModal }) => {
    const { fields, handleChange, errors, validate } = useForm(initialState);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidated = validate(validations)
        // console.log(isValidated, 'isValidated')
        // console.log(fields, 'fields!!!!!')
        // console.log(errors, 'errors!!!!!')

        if (!isValidated) return;

        // console.log('SUBMIT FUNCTION HERE!!!')
        writeUserData();
    }

    const writeUserData = async (userId, name, email, imageUrl) => {
        // const alphabet = '123456789';
        // const nanoid = customAlphabet(alphabet, 6);
        // const db = getDatabase();

        // const { first_name, last_name, graduation_year } = fields;

        // set(ref(db, 'players/' + nanoid()), {
        //     first_name,
        //     last_name,
        //     graduation_year,
        // });

        dispatch(createPlayer(fields));

        // const b = await request({ method: 'POST', url: '/api/players/', session: {
        //     first_name,
        //     last_name,
        //     graduation_year,
        // }})

        // console.log(b, 'bbbbb')


        closeModal();
    }

    return (
        <div className="bg-red-10">
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">Create Player</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    {/* <div className="mb-2">
                        <label className="text-sm text-gray-800">Season</label>
                        <Select options={optionsExample} onChange={e => setSelectedSeason(e)} value={selectedSeason} />
                    </div> */}

                    <div className="mb-2">
                        <label htmlFor="first_name" className="text-sm text-gray-800">First Name</label>
                        <input value={fields.first_name} onChange={handleChange}  type="text" name="first_name" id="first_name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.first_name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.first_name}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="last_name" className="text-sm text-gray-800">Last Name</label>
                        <input value={fields.last_name} onChange={handleChange} type="text" name="last_name" id="last_name" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.last_name ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.last_name}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="graduation_year" className="text-sm text-gray-800">Graduation Year</label>
                        <input value={fields.graduation_year} onChange={handleChange} type="number" maxLength={4} name="graduation_year" id="graduation_year" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.graduation_year ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.graduation_year}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-1">
                        <div className="flex gap-6">
                            <label htmlFor="is_home" className="text-sm text-gray-800">Add Player to Current Season</label>
                            <input checked={fields.add_to_current_season} onChange={handleChange} type="checkbox" maxLength={4} name="add_to_current_season" id="add_to_current_season" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        </div>
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.add_to_current_season ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.add_to_current_season}<span className="after:content-['.'] invisible"></span></p>
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
                        Create Player
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePlayerModal;
