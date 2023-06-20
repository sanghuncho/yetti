import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { emailRegExp } from '../../libs/regex';
import { encrypt } from '../../utils/encrypt';
import { getUserInfo, userAvailable, userLogin } from '../../api/userApi';
import { useDispatch } from 'react-redux';
import { removeStorage, setStorage, getStorage } from '../../utils/storage';
import { login, logout } from '../../redux/actions/user';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { errorMsg } from '../../utils/message';
import routes from '../../libs/routes';

// Components
import SnsLoginButton from '../../components/SnsLoginButton/SnsLoginButton';
import Contour from '../../components/Contour/Contour';

// Images & Icons
import googleLogo from '../../assets/images/img_google_logo.png';
import kakaoLogo from '../../assets/images/img_kakao_logo.png';
import facebookLogo from '../../assets/images/img_facebook_logo.png';
import { ReactComponent as PassIcon } from '../../assets/icons/ic_pass.svg';
import { ReactComponent as FailIcon } from '../../assets/icons/ic_fail.svg';

// Styles
import '../../styles/Login.scss';
import { isLogin } from '../../utils/isLogin';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
   
    const {register, setValue, handleSubmit, setError, formState : {errors}} = useForm({reValidateMode: 'onSubmit'});

    // 0: 입력 중 | 1: 잘못된 이메일 | 2: 가입된 이메일
    const[emailState, setEmailState] = useState(0);
    // 0: 입력 중 | 1: 잘못된 비밀번호
    const[passwordState, setPasswordState] = useState(0);
    
    /** 다음 버튼 클릭 이벤트(유효성 검사 통과) */
    const handleClickNext = async(data) => {
        console.log("handleClickNext");
        dispatch(startLoading());
        try {
            const isLogin = getStorage('login');
            if (isLogin === "true") {
                let userData = await getUserInfo();
                console.log(userData);
                dispatch(login({
                    "email": userData.data.email,
                    "name": userData.data.name
                }));
            }

            console.log('emailState ' + emailState);
            if(emailState !== 2) {
                // 이메일등록가능여부확인 API 연동
                let result = await userAvailable(data.email);

                // code 0 이 아님 : API 요청 실패
                if(result.code !== 0) {
                    errorMsg(result.message);
                    dispatch(endLoading());
                    return;
                }

                // API 요청 성공              
                // 이메일 등록 가능할 시 - 가입된 이메일 아님
                if(result.data) {
                    setError("email", { message: obj.not_join_email }, { shouldFocus: true });
                    dispatch(endLoading());
                    return;
                }
                setEmailState(2);
            } 

            
            if(emailState === 2) {
                // 비밀번호 암호화
                let encryptPw = await encrypt(data.password);
                
                // 로그인 API 연동
                let loginResult = await userLogin(data.email, encryptPw);

                // code 0 이 아님 : API 요청 실패
                if (loginResult.code !== 0) {
                    switch (loginResult.code) {
                        case -1021:
                            // 로그인된 세션이 있는 경우
                            setStorage('login', true);
                            break;
                        case -1024:
                            // 상태 오류
                            setError("password", { message: obj[loginResult.code] + ` [이메일 ${loginResult.detail}]` }, { shouldFocus: true });
                            dispatch(endLoading());
                            return;
                        default:
                            // setError("password", { message: obj.wrong_pw }, { shouldFocus: true });
                            setError("password", { message: obj[loginResult.code] }, { shouldFocus: true });
                            dispatch(endLoading());
                            return;
                    }
                }
        
                // API 요청 성공
                // 사용자정보 조회 API 연동
                let userData = await getUserInfo();
                
                // code -1010 : 로그인 세션 만료 / 로그인 상태 X
                // if(userData.code === -1010) {
                //     // 로그인 정보 제거
                //     dispatch(logout);
                //     removeStorage('login');
                //     dispatch(endLoading());
                //     return;
                // }

                // code 0 이 아님 : API 요청 실패
                if(userData.code !== 0) {
                    errorMsg(userData.message);
                    dispatch(endLoading());
                    return;
                }
        
                // API 요청 성공
                // 로그인 정보 저장
                setStorage('login', true);  // localsession 에 저장
                dispatch(login({
                    "email": userData.data.email ,
                    "name": userData.data.name,
                    "statusCode": userData.data.statusCode
                }));
                // 이벤트 화면으로 이동
                navigate(routes.event);
            }
        } catch (error) {
            console.log(error);
            errorMsg(`${error?.message}`);
            return;
        } finally {
            dispatch(endLoading());
        }
    }

    /** 다음 버튼 클릭 이벤트(유효성 검사 실패) */
    const handleError = (error) => {
        if(error?.email)
            setEmailState(1);
        if(error?.password)
            setPasswordState(1);
    }

    /** 비밀번호 찾기 버튼 이벤트 */
    const handleFindPassword = () => navigate(routes.findPassword + "/inputEmail");

    /** 회원가입 버튼 이벤트 */
    const handleJoin = () => navigate(routes.join + '/memberInfo');

    /** 구글 로그인 이벤트 */
    const handleGoogle = () => {
        console.log("Google Login")
    }

    /** 카카오 로그인 이벤트 */
    const handleKakao = () => {
        console.log("Kakao Login")
    }

    /** 페이스북 로그인 이벤트 */
    const handleFacebook = () => {
        console.log("Facebook Login")
    }

    // 유효성 검사 문구
    const obj = {
        "none": " ",
        "wrong_email": "이메일 형식이 맞지 않습니다. 입력하신 이메일 주소를 다시 한 번 확인해주세요.",
        "not_join_email": "가입된 이메일 주소가 아닙니다. 회원가입 후 이용해주세요.",
        // "wrong_pw": "비밀번호를 잘못 입력하셨습니다. 다시 입력해주세요.",
        "-1012": "비밀번호를 잘못 입력하셨습니다. 다시 입력해주세요.",
        "-1020": "사용할 수 없는 이메일 주소입니다.",
        // "-1021": "이미 로그인되어 있습니다.",
        "-1022": "가입되지 않은 이메일 주소 입니다.",
        "-1023": "사용자 이메일에서 인증을 진행해주세요.",
        "-1024": "로그인에 실패했습니다.",
    }

    return (
        <div className='login'>
            <h1>AppCatch</h1>
            <div className='center-area'>
                <div className='explain'>
                    <h2>LOGIN</h2>
                    <p>{emailState === 2 ? '비밀번호를 입력하세요.' : '로그인 하시려면 계정(이메일)을 입력하세요.'}</p>
                </div>
                <form onSubmit={handleSubmit(handleClickNext, handleError)}>
                    <div className='input-area'>
                        <input 
                            className={errors?.email ? 'input-red' : 'input'}
                            type="text" 
                            placeholder="E-mail을 입력해주세요."
                            {...register("email", {
                                required: obj.none,
                                pattern: {
                                    value: emailRegExp,
                                    message: obj.wrong_email,
                                },
                                onChange: () => { setEmailState(0); setValue("password", null); }
                            })}
                            autoFocus
                        />
                        {emailState === 0 ? null : emailState === 2 ? <PassIcon className='icon' /> : <FailIcon className='icon' />}
                    </div>
                    <span className='text-error'>{errors?.email?.message}</span>
                    {
                        emailState === 2 ? 
                        <div>
                            <div className='input-area'>
                                <input 
                                    className={errors?.password ? 'input-red' : 'input'}
                                    type="password" 
                                    placeholder="비밀번호를 입력해주세요."
                                    maxLength="15"
                                    {...register("password", {
                                        required: obj.none,
                                        onChange: () => setPasswordState(0)
                                    })}
                                    autoFocus
                                />
                                {passwordState === 0 ? null : <FailIcon className='icon' />}
                            </div>
                            <span className='text-error'>{errors?.password?.message}</span>
                        </div> : null
                    }
                    <button type='submit'>{emailState === 2 ? '로그인' : '다음'}</button>
                </form>
                {/*
                <Contour lineColor="#868686" text="OR" />
                <div>
                    <SnsLoginButton handler={handleGoogle} logo={googleLogo} text="구글 계정으로 로그인" textColor='#4E4E4E' background='#FFFFFF'></SnsLoginButton>
                    <SnsLoginButton handler={handleKakao} logo={kakaoLogo} text="카카오 계정으로 로그인" textColor='#4E4E4E' background='#FFE55A'></SnsLoginButton>
                    <SnsLoginButton handler={handleFacebook} logo={facebookLogo} text="페이스북 계정으로 로그인" textColor='#FFFFFF' background='#6284C8'></SnsLoginButton>
                </div>
                */}
            </div>
            <div className='bottom-area'>
                <button onClick={handleFindPassword}>비밀번호 찾기</button>
                <button onClick={handleJoin}>회원가입</button>
            </div>
        </div>
    );
};

export default Login;