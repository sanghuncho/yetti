

import React from 'react';


// Styles
import './Aside.scss';

// Images & Icons
import { ReactComponent as DownloadIcon } from '../../../assets/icons/ic_download.svg';

const Aside = () => {
    return (
        <div className="aside">
            <div className="asideMenu">
                <button className='menuSelect'>기본정보</button>
                <button>오류정보</button>
            </div>
           
            <div className='asideDownBtn'>
                <button><DownloadIcon className='icon' />JSON 저장</button>
                <button><DownloadIcon className='icon' />크래시덤프 저장</button>
            </div>
        </div>

    );
};

export default Aside;