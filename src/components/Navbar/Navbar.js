import React from 'react';
import { useSelector } from 'react-redux';

// Components
import NavButton from '../NavButton/NavButton';
import UserDropdown from '../UserDropdown/UserDropdown';

// Images & Icons
import { ReactComponent as UserIcon } from '../../assets/icons/ic_user.svg';

// Styles
import './Navbar.scss';

const Navbar = ({children}) => {

    const { name } = useSelector(({user}) => { return user.value})
    
    return (
        <div className='navbar'>
            <div className='navUserName'>
                {children}
            </div>
            <div className='user'>
                <UserIcon />
                <ul className='dropDown ' >
                    <NavButton text={name} />
                    <UserDropdown />
                </ul>
            </div>
        </div>
    );
};

export default Navbar;