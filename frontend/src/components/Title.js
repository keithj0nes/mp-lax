import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ children }) => {
    if (typeof children !== 'string') {
        console.error('props.children must be a string');
        return null;
    }

    const [first, ...rest] = children.split(' ');

    const styledFirst = (<span className="font-bold">{first}</span>);

    return (
        <div className="inline-block md:pr-20 border-b border-mpred mb-4">
            <h3 className="text-lg">{styledFirst} {rest.join(' ')}</h3>
        </div>
    );
};

export default Title;

Title.propTypes = {
    children: PropTypes.string.isRequired,
};
