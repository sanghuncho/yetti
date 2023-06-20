import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import routes from '../../libs/routes';

import MemberInfo from './subPages/MemberInfo';
import Confirm from './subPages/Confirm';
import TermOfUse from './subPages/TermOfUse';
import VerifyEmail from './subPages/VerifyEmail';
import Done from './subPages/Done';

// Styles
import '../../styles/Join.scss';

const Join = () => {
    const navigate = useNavigate();
    const location = useLocation();
   
    // 새로고침 막기 변수
    // const preventClose = (e) => {
    //     e.preventDefault();
    //     e.returnValue = ""; // chrome에서는 설정이 필요해서 넣은 코드
    // }

    // // 브라우저에 렌더링 시 한 번만 실행하는 코드
    // useEffect(() => {
    //     (() => {
    //         window.addEventListener("beforeunload", preventClose);  
    //     })();

    //     return () => {
    //         window.removeEventListener("beforeunload", preventClose);
    //     };
    // },[]);

    // 회원가입 필수 정보 State
    const[userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        checkPassword: ""
    })

    // 이메일 중복확인 여부 State
    const[isCheckEmail, setCheckEmail] = useState(false);

    // 로그인 하러가기 버튼 출력 여부
    const[isLoginBtn, setIsLoginBtn] = useState(false);

    // 현재 경로 확인
    useEffect(() => {
        // 회원가입 환영 화면 시 하단 로그인하러가기 버튼 미출력
        if(location.pathname === "/join/done") setIsLoginBtn(false);
        else setIsLoginBtn(true);
    }, [ location ])

    /** 
     * MemberInfo 화면 - 다음 버튼 클릭 이벤트(성함, 이메일 정보 저장) 
     * @param data react-hook-form 결과 데이터
     * @param setError react-hook-form의 setError 메서드
     */
    const handleMemberInfo = (data, setError) => {
        if(isCheckEmail){
            setUserData((preValue) => {
                return({...preValue, name: data.name, email: data.email});
            });
            navigate(routes.join + '/confirm')
        } else {
            setError("email", { message: '이메일 중복확인을 진행해주세요.' }, { shouldFocus: true });
        }
    }

    /** 
     * Confirm 화면 - 다음 버튼 클릭 이벤트(비밀번호 정보 State 저장) 
     * @param data react-hook-form 결과 데이터
     * @param setError react-hook-form의 setError 메서드
     */
    const handleConfirm = (data, setError) => {
        if(data.password !== data.checkPassword){
            setError("checkPassword", { message: '비밀번호가 다릅니다. 다시 입력해주세요.' }, { shouldFocus: true });
            return;
        } 
        setUserData((preValue) => {
            return({...preValue, password: data.password, checkPassword: data.checkPassword});
        });
        navigate(routes.join + '/termOfUse')
    }

    /** 로그인 하러가기 버튼 이벤트 */
    const handleLogin = () => navigate(routes.login);

    return (
        <div className='join'>
            <h1>회원가입</h1>
            <Routes>
                <Route path='memberInfo' element={<MemberInfo userData={userData} isCheckEmail={isCheckEmail} setCheckEmail={setCheckEmail} handleClickNext={handleMemberInfo} />} />
                <Route path='confirm' element={<Confirm userData={userData} handleClickNext={handleConfirm} />} />
                <Route path='termOfUse' element={<TermOfUse userData={userData} />} />
                <Route path='verifyEmail' element={<VerifyEmail />} />
                <Route path='done' element={<Done />} />
            </Routes>
            {isLoginBtn && <div className='bottom-area'>
                <span>이미 사용 중인 계정이 있으신가요?</span>
                <button onClick={handleLogin}>로그인 하러가기</button>
            </div>}
        </div>
    );
};

export default Join;