import React from 'react';

// styles
import './Contour.scss';

const Contour = ({text}) => {
    return (
        <div className='contour'>
            <hr/>
            {text ? <p>{text}</p> : null}
        </div>
    );
};

export default Contour;