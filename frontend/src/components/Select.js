import { useState } from "react";

const Select = ({ options, onChange, value, disabled }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');

    const handleChange = (option) => {
        setDropdownOpen(false);
        setSelectedValue(option);
        onChange(option);
    }

    return (
        <div className="relative">
            <div onClick={() => setDropdownOpen(false)} className={`${!dropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-10'} transition duration-200 fixed bg-black inset-0 z-50 `}></div>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                className={`${dropdownOpen ? 'z-50' : ''} disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed bg-white relative mt-1 text-left rounded form-input border border-gray-300 w-full px-3 py-2 sm:py-1 text-gray-500 hover:text-gray-600 font-medium hover:border-gray-400 focus:border-gray-400`}
            >
                {selectedValue.label || 'Select'}
                <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="caret-down"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    className="w-2 absolute top-0 bottom-0 right-3 h-full"
                >
                    <path
                        fill="currentColor"
                        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                    ></path>
                    </svg>
            </button>

            <div className={`${!dropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} w-full transition duration-200 z-50 origin-top-right absolute top-full left-0 right-auto md:left-auto md:right-0 min-w-56 bg-white border border-gray-200 rounded shadow-lg overflow-hidden mt-1 enter-done`}>
                <ul>
                    {options.map(option => {
                        return (
                            <li key={option.label} className="px-2 py-1 cursor-pointer hover:bg-gray-100" onClick={() => handleChange(option)}>{option.label}</li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Select;

// const optionsExample = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]
