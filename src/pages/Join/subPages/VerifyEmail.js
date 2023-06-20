import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../libs/routes';

// Images
import step3Image from '../../../assets/images/join_images/img_step03.png';
import sendEmailImage from '../../../assets/images/img_send_email.png';

const VerifyEmail = () => {

    const navigate = useNavigate();

    /** 다음 버튼 클릭 이벤트 */
    const handleClickNext = () => navigate(routes.join + '/done')

    return (
        <div className='center-area verifyEmail'>
            <img className='stepImage' src={step3Image} alt="Step3 이미지" />
            <img className='sendImage' src={sendEmailImage} alt="이메일 전송 이미지" />
            <div className='explain'>
                <h2>본인인증 안내 메일이 전송되었습니다.</h2>
                <p>입력하신 이메일로 본인인증 이메일을 발송하였습니다.<br />본인인증 후 회원가입을 완료해주세요.</p>
            </div>
            <button type='submit' onClick={handleClickNext}>다음</button>
        </div>
    );
};

export default VerifyEmail;