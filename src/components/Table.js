import { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { ArrowDownIcon } from '@heroicons/react/solid';
import ReactTooltip from "react-tooltip";
import { Title } from "./";


const Table = ({ headers, columns, body, uniqueKey, title }) => {

    const [sortBy, setSortBy] = useState(headers.find(h => h.default)?.sort || null);
    const [sortDir, setSortDir] = useState('asc');

    // useEffect(() => {
    //     // set ordering if query params exist
    //     const queryParams = {...router.query};
    //     // delete queryParams.tab

    //     if (Object.keys(queryParams).length !== 0) {
    //         setSortBy(queryParams.orderby);
    //         setSortDir(queryParams.dir);
    //     }
    // }, [])

    const applySort = (sortField) => {
        let direction = sortDir === 'asc' ? 'desc' : 'asc'
        if (sortField !== sortBy) {
            direction = 'asc'
        }
        console.log(sortField, 'sortField')
        setSortBy(sortField);
        setSortDir(direction);

        // router.push({ query: { ...router.query, orderby: sortField, dir: direction }});
    }


// {/* <a data-tip data-for='sadFace'> இдஇ </a> */}
// {/* <ReactTooltip id='sadFace' type='warning' effect='solid'>
//   <span>Show sad face</span>
// </ReactTooltip> */}

    const TableSort = ({ label, sort, className, alt }) => {
        const isSortable = sort !== undefined;
        const active = sort === sortBy;
        return (
            <th className={`p-2 ${className}`}>
                <a
                    href
                    data-tip
                    data-for={label}
                    onClick={() => !!sort && applySort(sort)}
                    className={classnames(
                        `font-semibold text-left relative block`,
                        {
                            'hover:underline cursor-pointer': !!sort,
                        }
                    )} 
                >
                    {label}

                    <ArrowDownIcon className={classnames(
                        `inline h-3 mx-1 absolute top-px text-indigo-500`,
                        {
                            'invisible': !isSortable || !active,
                            'rotate-180': sortDir === 'desc',
                        }
                        )} 
                    />
                </a>
                {alt && (
                    <ReactTooltip id={label} type='dark' effect='solid'>
                        <span className="font-normal text-xs">{alt}</span>
                    </ReactTooltip>
                )}
            </th>
        )
    }

    body.sort((a, b) => {
        // console.log(sortBy, 'sortBysortBysortBysortBy')
        // console.log(a, b, 'A B')
        // console.log(a[sortBy], b[sortBy], 'a[sortBy] b[sortBy]')
        // console.log(typeof a[sortBy], typeof b[sortBy], 'type offfff')
        // return 
        if (!sortBy) return null;
        if (
            (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') ||
            (typeof a[sortBy] === 'boolean' && typeof b[sortBy] === 'boolean')
        ) {
            if (sortDir === 'asc') {
                return a[sortBy] - b[sortBy]
            }
            return b[sortBy] - a[sortBy]
        }

        if (sortDir === 'asc') {
            return a[sortBy].localeCompare(b[sortBy])
        }
        return b[sortBy].localeCompare(a[sortBy])
    })

    // TODO: really need to streamline this function
    const switchType = (type, value, keyValue, item, ind) => {
        // console.log({type, value, keyValue, item, ind})
        
        switch (type) {
            case 'number':
            case 'string':
            case 'date':
                return keyValue || value;
            case 'index':
                return ind + 1;
            // case 'math/currency':
            //     const formatted = variableStringFormatter(value.format, item).replace(/\s/g, '');
            //     const splitOnOperators = formatted.match(/[^\d()]+|[\d.]+/g);
            //     const [num1, op, num2] = splitOnOperators;
            //     let answer
            //     switch (op) {
            //         case '*':
            //             answer = num1 * num2;
            //             break;
            //         case '/':
            //             answer = num1 / num2;
            //             break;
            //         case '+':
            //             answer = num1 + num2;
            //             break;
            //         case '-':
            //             answer = num1 - num2;
            //             break;
            //         default:
            //             break;
            //     }

                // console.log(currency(answer))
            //     return currency(answer)
            // case 'currency':
            //     return currency(value);
            case 'boolean':
                if (value.hasOwnProperty('trueValue') && value.hasOwnProperty('falseValue')) {
                    return keyValue ? value.trueValue : value.falseValue;
                }
            // console.log(type, value, keyValue, 'type value BOOLEAN!!!!')
                // if (!keyValue) console.warn('Please make sure column is an object with a format key [SortableTable.js boolean]')
                return !!keyValue ? value.format : null;
            case 'link':
                // console.log(type, value, keyValue, item, 'type value LINK!!')
                const href = variableStringFormatter(value.format, item)

                // console.log(href, 'rhehfhf')
                const as = variableStringFormatter(value.as, item)

                return (
                    <Link to={href} className="hover:text-mpred">
                        {/* <a className="text-xs hover:text-gray-800 transition duration-200 underline" href=""> */}
                            {as}
                            {/* </a> */}
                    </Link>
                );
            default:
                return value;    
                
        }
    }

    return (
        <div className="col-span-full xl:col-span-6 bg-white">
            {title && (
                <>
                    {/* <div className="px-5 py-4 border-b border-gray-200 bg-emerald-200">
                        <h2 className="font-semibold text-gray-800">{title} - (custom table)</h2>
                    </div> */}

                    {/* <div className="inline-block md:pr-20 border-b border-black mb-4">
                        <h3 className="text-lg font-bold">{title}</h3>
                    </div> */}
                    <div>


                        <Title>{title}</Title>
                    </div>
                </>
            )}
        {/* <h2>Sortable Table component</h2> */}

            {/* <div className="p-3"> */}
            <div className="p-0">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="text-xs uppercase text-gray-400 bg-gray-50 rounded-sm border-b border-gray-200">
                            <tr>
                                {headers.map(item => {
                                    return (
                                        <TableSort label={item.label} alt={item.alt} sort={item.sort} className={item.className} key={item.label} />
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody className="text-sm font-medium divide-y divide-gray-200">

                            {body.map((item, ind) => {
                                return (
                                    <tr key={uniqueKey ? item[uniqueKey] :item.id} className="hover:bg-gray-50">
                                        {Object.entries(columns).map(([colKey, colValue]) => {
                                            // console.log(colKey, colValue, 'COL')
                                            let formattedRow;
                                            if (typeof colValue === 'object') {
                                                formattedRow = switchType(colValue.type, colValue, item[colKey], item, ind)
                                                return (
                                                    <td className={`p-2 ${colValue.className || ''}`} key={colKey}>{formattedRow}</td>
                                                )
                                            } 

                                            formattedRow = switchType(colValue, item[colKey], null, null, ind);
                                            // console.log(stuff, 'STUFF!!!')
                                            return (
                                                <td className="p-2" key={colKey}>{formattedRow}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>                        
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Table;

// this function takes the format string, replaces the $variable_name with the variable passed into the data prop and returns the original string with replaced variables
// format: '/dashboard/orders/$id'

function variableStringFormatter(str, data) {
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

