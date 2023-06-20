import React from 'react';

import MainMenu from '../../components/MainMenu/MainMenu';

// Styles
import './MenuLayout.scss';

const MenuLayout = ({children}) => {
    return (
        <div className='layout'>
            <MainMenu />
            <main>
                {children}
            </main>
        </div>
    );
};

export default MenuLayout;