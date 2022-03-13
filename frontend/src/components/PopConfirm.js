import React, { useState } from 'react';
import PropTypes from 'prop-types';


const PopConfirm = ({ onConfirm, disabled, children, cancelText, confirmText, title }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleOnConfirm = () => {
        setDropdownOpen(false);
        onConfirm();
    };

    return (
        <div className="relative">
            <div onClick={() => setDropdownOpen(false)} className={`${!dropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-20'} transition duration-200 fixed bg-black inset-0 z-50 `} />

            <div className="relative inline">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    className="transition duration-300 text-mpred py-1 px-3 hover:text-mpblue hover:bg-transparent"
                >
                    {children}
                </button>

                <div className={`${!dropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition duration-200 p-2 z-50 origin-top-right absolute bottom-full left-0 right-auto min-w-56 bg-white rounded shadow-lg overflow-hidden mb-2 enter-done whitespace-nowrap`}>
                    <p className="text-sm pb-2 text-center">{title}</p>

                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="text-xs px-1 py-0.5 mr-3 text-gray-600 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleOnConfirm}
                        className="text-xs px-1 py-0.5 bg-mpred-200 text-white hover:bg-mpred"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

        </div>
    );
};

PopConfirm.defaultProps = {
    disabled: false,
    children: 'Delete',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    title: 'Are you sure?',
};

export default PopConfirm;

PopConfirm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.string,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    title: PropTypes.string,
};
