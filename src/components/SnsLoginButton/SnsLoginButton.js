import React from 'react';

// Styles
import './SnsLoginButton.scss';

/** 
 * SNS 로그인 버튼
 * @param handler 버튼 클릭 이벤트
 * @param logo 로고 이미지
 * @param text 버튼 Text
 * @param textColor 버튼 색상
 * @param background 버튼 배경 색상
*/
const SnsLoginButton = ({handler, logo, text, textColor, background}) => {
    return (
        <button className='snsLogin' style={{color: textColor, backgroundColor: background}} onClick={handler}>
            <img src={logo} alt="Logo"></img>
            <span>{text}</span>
        </button>
    );
};

export default SnsLoginButton;