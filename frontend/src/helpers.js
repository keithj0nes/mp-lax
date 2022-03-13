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
