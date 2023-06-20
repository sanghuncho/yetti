import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../libs/routes';

// Images
import step4Image from '../../../assets/images/join_images/img_step04.png';
import welcomeImage from '../../../assets/images/img_welcome.png';

const Done = () => {

    const navigate = useNavigate();

    /** 다음 버튼 클릭 이벤트 */
    const handleClickNext = () => navigate(routes.login)

    return (
        <div className='center-area done'>
            <img className='stepImage' src={step4Image} alt='회원가입 완료 이미지'/> 
            <img className='welcomeImage' src={welcomeImage} alt='환영합니다 이미지'/> 
            <div className='explain'>
                <h2>AppCatch 서비스 가입을 환영합니다!</h2>
                <p>메일인증을 완료하면, 회원가입이 완료됩니다.<br />메일인증 후, 로그인 해주세요.</p>
            </div>
            <button type='submit' onClick={handleClickNext}>로그인 화면으로 돌아가기</button>
        </div>
    );
};

export default Done;