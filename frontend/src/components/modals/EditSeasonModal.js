import { useEffect, useState } from "react";
import { getDatabase, ref, onValue} from "firebase/database";

const EditSeasonModal = ({ closeModal }) => {
    const [state, setState] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const db = getDatabase();
        // console.log(db,' dbbbb')
        const starCountRef = ref(db, 'seasons');
        console.log(starCountRef, 'starcoutn')
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data, 'data')
            // updateStarCount(postElement, data);
            setState(data);
        });

    }, [])

    return (
        <div>
            <div className="px-4 pt-4 pb-3 border-b border-gray-300">
                <h3 className="font-bold">{isEditing ? 'Edit Season' : 'Seasons'}</h3>
            </div>
            <div>

                <div className="">
                    {!isEditing && state && Object.keys(state).map(seasonId => {
                        const data = state[seasonId];
                        return (
                            <div className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                                <div>
                                    <h3>{data.season_name}</h3>
                                    <p className="text-sm">{data.is_active ? <span className="text-green-400">Active</span> : <span className="text-red-400">Not active</span> }</p>
                                </div>
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                            </div>
                        )
                    })}
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
            </div>
        </div>
    )
}

export default EditSeasonModal;
