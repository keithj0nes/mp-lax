// import toRegexRange from 'to-regex-range';
// import { getDatabase, ref, set } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux'
// import { customAlphabet } from 'nanoid'
import { useForm } from "../../hooks";
// import { request } from '../../request';
import { createGame } from '../../redux/slices/gamesSlice';
import { Loader } from '../';

// const validFromYear = new Date().getFullYear() - 3;
// const validToYear = validFromYear + 6;
// const validYearsRegex = toRegexRange(validFromYear, validToYear, { capture: true });

// const newd = new Date();
const initialState = {
    opponent: '',
    location: '',
    start_date: new Date().toLocaleString(),
    is_home: false,
}

const validations = {
    opponent: {
        required: {
            value: true,
            message: 'Opponent is required',
        },
    },
    location: {
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
}

const CreateGameModal = ({ closeModal }) => {
    const { fields, handleChange, errors, validate } = useForm(initialState);
    const { isLoading } = useSelector(state => state.games);
    const dispatch = useDispatch();

    console.log(isLoading,' is LAODINGGGG')

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

        const shouldClose = await dispatch(createGame(fields));

        console.log(shouldClose, 'SHOULD CLOSE')

        // const b = await request({ method: 'POST', url: '/api/players/', session: {
        //     first_name,
        //     last_name,
        //     graduation_year,
        // }})

        // console.log(b, 'bbbbb')


        shouldClose && closeModal();
    }

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
                    <div className="mb-1">
                        <label htmlFor="opponent" className="text-sm text-gray-800">Opponent</label>
                        <input value={fields.opponent} onChange={handleChange}  type="text" name="opponent" id="opponent" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.opponent ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.opponent}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-1">
                        <label htmlFor="location" className="text-sm text-gray-800">Location</label>
                        <input value={fields.location} onChange={handleChange}  type="text" name="location" id="location" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.location ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.location}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-1">
                        <label htmlFor="start_date" className="text-sm text-gray-800">Start Date</label>
                        <input value={fields.start_date} onChange={handleChange} type="text" name="start_date" id="start_date" className="mt-1 rounded form-input border border-gray-300 w-full px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.start_date ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.start_date}<span className="after:content-['.'] invisible"></span></p>
                    </div>

                    <div className="mb-1">
                        <div className="flex">
                            <input checked={fields.is_home} onChange={handleChange} type="checkbox" maxLength={4} name="is_home" id="is_home" className="mt-1 rounded form-input border border-gray-300 px-3 py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400" />
                            <label htmlFor="is_home" className="pl-3  text-sm text-gray-800">Home Game?</label>
                        </div>
                        <p className={`pt-0.5 text-xs text-mpred transition duration-300 ${!!errors.is_home ? 'text-opacity-100' : 'text-opacity-0'}`}>{errors.is_home}<span className="after:content-['.'] invisible"></span></p>
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

export default CreateGameModal;
