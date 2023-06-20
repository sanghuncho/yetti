import React from 'react';

// Styles
import './Title.scss';

const Title = React.memo(({title, bgColor}) => {
    return (
        <div className="titleStyle" style={{backgroundColor: bgColor}}>
            {title}
        </div>
    );
});

export default Title;