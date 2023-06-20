import React from 'react';
import routes from '../../../libs/routes';
import { useNavigate } from 'react-router-dom';

// Images
import sendEmailImage from '../../../assets/images/img_send_email.png';

const ResetPassword = () => {
    const navigate = useNavigate();

    /** 로그인 화면으로 돌아가기 버튼 이벤트 */
    const handleLogin = () => navigate(routes.login);

    return (
        <div className='center-area resetPassword'>
            <img src={sendEmailImage} alt="이메일 전송 이미지"/>
            <div className='explain' >
                <h2>비밀번호 변경 안내 메일이 전송되었습니다.</h2>
                <p>입력하신 이메일로 비밀번호 변경 안내 이메일을 발송하였습니다.<br />이메일 수신함을 확인해주세요.</p>
            </div>
            <button type='submit' onClick={handleLogin}>로그인 화면으로 돌아가기</button>
        </div>
    );
};

export default ResetPassword;