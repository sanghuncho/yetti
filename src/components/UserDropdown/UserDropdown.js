import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../api/userApi';
import { removeStorage } from '../../utils/storage';
import { logout } from '../../redux/actions/user';
import routes from '../../libs/routes';

// Images
import { ReactComponent as MypageIcon } from '../../assets/icons/ic_mypage.svg';
import { ReactComponent as ServiceIcon } from '../../assets/icons/ic_service.svg';
import { ReactComponent as InquiryIcon } from '../../assets/icons/ic_inquiry.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/ic_logout.svg';

// Styles
import  './UserDropdown.scss';
import  './UserDropdownBack.scss'

const UserDropdown = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /** 내 정보 관리 클릭 이벤트 */
    const handleClickMypage = () => navigate(routes.management);

    /** 서비스 관리 클릭 이벤트 */
    const handleClickService = () => navigate(routes.management);

    /** 문의하기 클릭 이벤트 */
    const handleClickInquiry = () => {};

    /** 로그아웃 클릭 이벤트 */
    const handleClickLogout = () => {
        userLogout().then(() => {
            removeStorage('login');
            dispatch(logout()); 
            navigate(routes.login)
        })
    };

    return (
        <div className='periodDropDownBack'>
            <div className='userDropdown'>
                <li onClick={handleClickMypage}><MypageIcon className='icon' />내정보 관리</li>
                <li onClick={handleClickService}><ServiceIcon className='icon' />서비스 관리</li>
                {/*<li onClick={handleClickInquiry}><InquiryIcon className='icon' />문의하기</li>*/}
                <li onClick={handleClickLogout}><LogoutIcon className='icon' />로그아웃</li>
            </div>
        </div>
    );
};

export default UserDropdown;