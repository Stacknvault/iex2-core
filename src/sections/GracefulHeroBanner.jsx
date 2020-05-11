import React from 'react';
import PropTypes from 'prop-types';

const GracefulHeroBanner = ({className})=>{
    return (
        <div className={className}>The GracefulHeroBanner section</div>
    );
}

GracefulHeroBanner.propTypes={
    className: PropTypes.string
}
export default GracefulHeroBanner;
