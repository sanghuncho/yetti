import React from 'react';

// Icons
import { ReactComponent as ArrowTopIcon } from '../../assets/icons/ic_arrow_top.svg';
import { ReactComponent as ArrowBottomIcon } from '../../assets/icons/ic_arrow_bottom.svg';

// Styles
import './NavButton.scss';

const NavButton = React.memo(({text, clickState, clickEvent, isBackColor}) => {
    return (
        <div className={clickState && isBackColor ? 'navButton navButton-hide' : 'navButton'} onClick={clickEvent}>
            <span>{text}</span>
            {clickState ? <ArrowTopIcon className='icon' /> : <ArrowBottomIcon className='icon'/> }
        </div>
    );
});

export default NavButton;