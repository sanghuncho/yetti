import React from 'react';

import MainMenu from '../../components/MainMenu/MainMenu';

// Styles
import './MainLayout.scss';

const MainLayout = ({children}) => {
    return (
        <div className='mainLayout'>
            <MainMenu />
            <main>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;