// this function takes the format string, replaces the $variable_name with the variable passed into the data prop and returns the original string with replaced variables
// format: '/dashboard/orders/$id'
export function variableStringFormatter(str, data) {
    // return str.split(/(?=[\s.,:;-])|(?<=[\s.,:;-])/g).map(item => {
    return str.split(/([\s()/.,:;-])/g).map(item => {
        if (item.charAt(0) === '$') {
            return Object.keys(data).map(i => {
                if (i === item.slice(1)) {
                    return data[i] || '0';
                }
                return null;
            }).filter(Boolean);
        }
        return item;
    }).join('');
}

// eslint-disable-next-line no-promise-executor-return
export const wait = t => new Promise(resolve => setTimeout(resolve, t));


export const getGrade = gradYear => {
    const GRADETYPES = {
        0: { label: 'Senior', as: 'SR' },
        1: { label: 'Junior', as: 'JR' },
        2: { label: 'Sophomore', as: 'SO' },
        3: { label: 'Freshman', as: 'FR' },
    };
    const thisYear = new Date().getFullYear();
    const m = gradYear - thisYear;
    if (m < 0) return { label: 'Graduated' };
    if (m > 3) return { label: 'Not in high school' };
    return GRADETYPES[gradYear - thisYear];
};
