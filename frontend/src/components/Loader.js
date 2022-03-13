import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ loading, fullScreen }) => {
    if (!loading) return null;

    if (fullScreen) {
        return (
            <div className="bg-white/40 w-full h-full fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
                <div className="loader loader--style2" title="1">
                    <svg
                        version="1.1"
                        id="loader-1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        width="40px"
                        height="40px"
                        viewBox="0 0 50 50"
                        style={{ enableBackground: 'new 0 0 50 50' }}
                        xmlSpace="preserve"
                    >
                        <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                            <animateTransform
                                attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                from="0 25 25"
                                to="360 25 25"
                                dur="0.6s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="loader loader--style2" title="1">
            <svg
                version="1.1"
                id="loader-1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="40px"
                height="40px"
                viewBox="0 0 50 50"
                style={{ enableBackground: 'new 0 0 50 50' }}
                xmlSpace="preserve"
            >
                <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                    <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.6s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
        </div>
    );
};

export default Loader;

Loader.propTypes = {
    loading: PropTypes.bool.isRequired,
    fullScreen: PropTypes.bool,
};

Loader.defaultProps = {
    fullScreen: true,
};
