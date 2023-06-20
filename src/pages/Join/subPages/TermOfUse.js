import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { privacyTerm, serviceTerm } from '../../../libs/term';
import { userRegister } from '../../../api/userApi';
import { joinEncrypt } from '../../../utils/encrypt';
import { endLoading, startLoading } from '../../../redux/actions/loading';
import { errorMsg } from '../../../utils/message';
import routes from '../../../libs/routes';

// Conponents
import Contour from '../../../components/Contour/Contour';
import Modal from '../../../components/Modal/TermModal';

// Images & Icons
import step3Image from '../../../assets/images/join_images/img_step03.png';
import { ReactComponent as CheckBoxOn } from '../../../assets/icons/ic_checkbox_on.svg';
import { ReactComponent as CheckBoxOff } from '../../../assets/icons/ic_checkbox_off.svg';
import { ReactComponent as ArrowRight } from '../../../assets/icons/ic_arrow_right.svg';

const TermOfUse = ({userData}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 이용약관 체크 상태 State
    const[isCheckedAll, setIsCheckedAll] = useState(false);
    const[isChecked, setIsChecked] = useState({
        service: false,
        privacy: false
    })

    // 동의서 모달 내용 및 출력 상태 State
    const[contents, setContents] = useState("");
    const[isOpen, setIsOpen] = useState(false);

    /** 모두 동의합니다 체크 이벤트 */
    const handleAllCheck = () => {
        if(isCheckedAll){
            setIsCheckedAll(false);
            setIsChecked((preValue) => {
                return({
                    ...preValue,
                    service: false,
                    privacy: false
                })
            });
            return;
        }
        setIsCheckedAll(true);
        setIsChecked((preValue) => {
            return({
                ...preValue,
                service: true,
                privacy: true
            })
        });
    }

    /** 각 동의서 별 체크 이벤트 */
    const handleCheck = (id) => {
        let service = isChecked.service;
        let privacy = isChecked.privacy;

        // 이용약관 동의서 별 체크 상태 변경
        if(id === 'service') {
            service = !service;
        }
        if(id === 'privacy') {
            privacy = !privacy;
        }

        setIsChecked((preValue) => {
            return({
                ...preValue,
                service: service,
                privacy: privacy
            })
        });

        // 이용약관 체크 상태에 따른 모두 동의 상태 변경
        if(service && privacy)
            setIsCheckedAll(true);
        else
            setIsCheckedAll(false);
    }

    /** 서비스 이용 약관 동의서 보기 이벤트 */
    const handleServiceTerm = () => {
        setContents(serviceTerm);
        setIsOpen(true);
    }

    /** 개인정보 수집 및 이용 동의서 보기 이벤트 */
    const handlePrivacyTerm = () => {
        setContents(privacyTerm);
        setIsOpen(true);
    }

    /** 다음 버튼 클릭 이벤트 */
    const handleClickNext = async() => {
        dispatch(startLoading());
        try{
            let encryptPw = await joinEncrypt(userData.password)

            // 회원가입 API 연동
            let result = await userRegister(userData.email, userData.name, encryptPw);

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                dispatch(endLoading());
                return;
            }

            // API 요청 성공
            navigate(routes.join + '/verifyEmail');

        } catch (error) {
            console.log(error);
            errorMsg(`${error?.message}`);
            dispatch(endLoading());
            return;
        }
        dispatch(endLoading());
    }

    return (
        <div className='center-area termOfUse'>
            <img className='stepImage' src={step3Image} alt="Step3 이미지"/>
            <h2>이용약관 동의<span>*</span></h2>
            <div className='term-area'>
                <div className='check-item'>
                    <label htmlFor="all">
                        {isCheckedAll ? <CheckBoxOn /> : <CheckBoxOff /> } 
                    </label>
                    <input type="checkbox" id="all" onChange={handleAllCheck} checked={isCheckedAll} />   
                    <span>모두 동의합니다.</span>
                </div>
                <Contour lineColor="#C4CEE1"/>
                <div className='check-item'>
                    <label htmlFor="service">
                        {isChecked.service ? <CheckBoxOn /> : <CheckBoxOff /> } 
                    </label>
                    <input type="checkbox" id="service" onChange={(e) => handleCheck(e.target.id)} checked={isChecked.service} />   
                    <span>(필수) 서비스 이용 약관 동의서 </span>
                    <ArrowRight className='arrow' onClick={handleServiceTerm} />
                </div>
                <div className='check-item'>
                    <label htmlFor="privacy">
                        {isChecked.privacy ? <CheckBoxOn /> : <CheckBoxOff /> } 
                    </label>
                    <input type="checkbox" id="privacy" onChange={(e) => handleCheck(e.target.id)} checked={isChecked.privacy} />   
                    <span>(필수) 개인정보 수집 및 이용 동의서 </span>
                    <ArrowRight className='arrow' onClick={handlePrivacyTerm} />
                </div>
            </div>
            <button type='submit' disabled={!isCheckedAll} onClick={handleClickNext}>다음</button>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} contents={contents}></Modal>
        </div>
    );
};

export default TermOfUse;