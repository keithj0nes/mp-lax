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
        0: { label: 'senior', as: 'SR' },
        1: { label: 'junior', as: 'JR' },
        2: { label: 'sophomore', as: 'SO' },
        3: { label: 'freshman', as: 'FR' },
        4: { label: '8th grade', as: '8th' },
        5: { label: '7th grade', as: '7th' },
        6: { label: '6th grade', as: '6th' },
        7: { label: '5th grade', as: '5th' },
        8: { label: '4th grade', as: '4th' },
    };
    const thisYear = new Date().getFullYear();
    const m = gradYear - thisYear;
    if (m < 0) return { label: `Graduated in ${gradYear}` };
    if (m > Object.keys(GRADETYPES).length) return { label: 'N/A' };
    return GRADETYPES[gradYear - thisYear];
};
