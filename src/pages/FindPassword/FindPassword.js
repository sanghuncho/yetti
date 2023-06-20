import React from 'react';
import routes from '../../libs/routes';
import { Route, Routes, useNavigate } from 'react-router-dom';

import InputEmail from './subPages/InputEmail';
import ResetPassword from './subPages/ResetPassword';

// Styles
import '../../styles/FindPassword.scss'

const FindPassword = () => {
    const navigate = useNavigate();

    /** 회원가입 버튼 이벤트 */
    const handleJoin = () => navigate(routes.join + '/memberInfo')

    return (
        <div className='findPassword'>
            <h1>비밀번호 찾기</h1>
            <Routes>
                <Route path='inputEmail' element={<InputEmail />} />
                <Route path='resetPassword' element={<ResetPassword />} />
            </Routes>
            <div className="bottom-area">
                <span>아직 계정이 없으신가요?</span>
                <button onClick={handleJoin}>회원가입 하러가기</button>
            </div>
        </div>
    );
};

export default FindPassword;