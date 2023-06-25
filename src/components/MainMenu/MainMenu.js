import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { menuOpen, menuClose } from '../../redux/actions/menu';
import routes from '../../libs/routes';

// Images & Icons
import { ReactComponent as EventIcon } from '../../assets/icons/ic_event.svg';
import { ReactComponent as StatisticsIcon } from '../../assets/icons/ic_statistics.svg';
import { ReactComponent as ManagementIcon } from '../../assets/icons/ic_management.svg';
import { ReactComponent as NotificationIcon } from '../../assets/icons/ic_notification.svg';
import { ReactComponent as GuideIcon } from '../../assets/icons/ic_guide.svg';

import MainMenuOnImage from '../../assets/images/img_mainMenu_on.png';
import MainMenuOffImage from '../../assets/images/img_mainMenu_off.png';

// Styles
import './MainMenu.scss';

const MainMenu = React.memo(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const menuState = useSelector(({menu}) => {
        return menu.value.isOpen;
    });

    // 현재 경로 및 MENU 열림/닫힘 State
    const[pathname, setPathname] = useState("");
    const[isMenuOpen, setIsMenuOpen] = useState(menuState);

    useEffect(() => {
        setPathname(location.pathname);
    }, [location])

    // 이벤트 클릭 이벤트
    const handleClickEvent = () => navigate(routes.event);

    // 통계/리포트 클릭 이벤트
    const handleClickStatistics = () => navigate(routes.statistics);

    // 관리 클릭 이벤트
    const handleClickManagement = () => navigate(routes.management);
    
    // 사용자 가이드 클릭 이벤트
    const handleClickFAQ = () => navigate(routes.faq);

    const handleClickGuide = () => {
        const url = "./guide/api/index.html";
        window.open(url, "_blank");
    }

    // 알림 클릭 이벤트
    const handleClickNotification = () => navigate(routes.notification);

    // 메뉴 접기, 펼치기 이벤트
    const handleMenuHide = () => {
        dispatch(!isMenuOpen ? menuOpen() : menuClose(false));
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className={isMenuOpen ? 'mainMenu' : 'mainMenu mainMenu-hide' }>
            <h1>AppCatch</h1>
            <div>
                <button className={pathname === routes.event ? 'focused' : null} onClick={handleClickEvent}>
                    <EventIcon className='icon' />
                    <span className='menuEvent'>이벤트</span>
                </button>
                <button className={pathname === routes.statistics ? 'focused' : null} onClick={handleClickStatistics}>
                    <StatisticsIcon className='icon' />
                    <span className='menuStat'>통계/<br/>리포트</span>
                </button>
                <button className={pathname === routes.management ? 'focused' : null} onClick={handleClickManagement}>
                    <ManagementIcon className='icon' />
                    <span>관리</span>
                </button>
                <button style={{"cursor":"default"}}>
                    <GuideIcon className='icon' />
                    <span>문서</span>
                </button>
                <button className='subButton' onClick={handleClickGuide}>
                    <span className='menuGuide'>사용자 가이드</span>
                </button>
                <button className={`${pathname === routes.faq ? 'focused' : null}`} onClick={handleClickFAQ}>
                    <span className='menuFaq'>FAQ</span>
                </button>
            </div>
            <div className="sidebar-button-frame">
                <img className='menu-button' src={isMenuOpen ? MainMenuOnImage : MainMenuOffImage} alt="Menu 접기" onClick={handleMenuHide} />
            </div>
        </div>
    );
});

export default MainMenu;