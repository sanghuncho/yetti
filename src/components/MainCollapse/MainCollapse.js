import React from 'react';

// Styles
import './MainCollapse.scss';

const MainCollapse = ({children}) => {
    return (
        <div className='mainCollapse'>
            <div className='contentArea'>
                {children}
            </div>
        </div>
    );
};

export default MainCollapse;