/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useEffect, useState } from 'react';

export default function useForm(initialState = {}) {
    const [fields, setFields] = useState(initialState);
    const [errors, setErrors] = useState({});
    const initalValues = Object.values(initialState).join('');

    useEffect(() => {
        setFields(initialState);
    }, [initalValues]);

    const handleChange = (e, key) => {
        // if (!e.target) {
        //     console.log(e, 'eeeeeeeeee')
        // }
        // console.log(key, 'keeeyy')
        const { name, type, files, checked } = e.target;
        let { value } = e.target;

        // console.log(type, name, checked, value, 'TYPEEEE')

        if (type === 'number') {
            // use maxLength on type: number
            if (e.target.attributes?.maxlength) {
                if (value.length > e.target.attributes?.maxlength.value) return;
            }
            value = parseFloat(value);
        }
        if (type === 'file') {
            [value] = files;
        }

        if (key) {
            setFields({
                ...fields,
                [key]: {
                    ...fields[key],
                    [name]: { value: type === 'checkbox' ? checked : value },
                },
            });
            return;
        }

        setFields({
            ...fields,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validate = (validations) => {
        let valid = true;
        const newErrors = {};
        for (const key in validations) {
            // value of the field we're validating
            const value = fields[key];
            // the matching validation rule for this key
            const validation = validations[key];
            // REQUIRED
            if (validation?.required?.value !== false && !value) {
                valid = false;
                newErrors[key] = validation?.required?.message;
            }
            // PATTERN
            const pattern = validation?.pattern;

            // console.log(pattern?.value, 'RegExp(pattern.value).test(value)')
            if (pattern?.value && !RegExp(pattern.value).test(value)) {
                valid = false;
                newErrors[key] = pattern.message;
            }
            // CUSTOM
            const custom = validation?.custom;
            if (custom?.isValid && !custom.isValid(value)) {
                valid = false;
                newErrors[key] = custom.message;
            }
        }

        // console.log(newErrors, 'newErrors')

        if (!valid) {
            setErrors(newErrors);
            return false;
        }
        setErrors(newErrors);
        return true;
    };

    const resetForm = () => {
        setFields(initialState);
    };

    const clearForm = () => {
        const clearedState = Object.fromEntries(
            Object.entries(fields).map(([key]) => [key, '']),
        );
        setFields(clearedState);
    };

    return { fields, handleChange, resetForm, clearForm, errors, validate };
}
