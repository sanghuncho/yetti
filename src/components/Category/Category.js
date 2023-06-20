import React from 'react';

// Images & Icons
import { ReactComponent as HomeIcon } from '../../assets/icons/ic_home.svg';

// Styles
import './Category.scss';

const Category = ({text, isIcon = true}) => {
    return (
        <div className='category'>
            <div className='icon'>{isIcon ? <HomeIcon/> : null}</div>
            <p>{'>'} {text}</p>
        </div>
    );
};

export default Category;