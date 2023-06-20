import React from 'react';
import { useForm } from 'react-hook-form';
import { emailRegExp } from '../../../libs/regex';
import { userAvailable } from '../../../api/userApi';
import { errorMsg } from '../../../utils/message';

// Images
import step1Image from '../../../assets/images/join_images/img_step01.png';

const MemberInfo = ({userData, isCheckEmail, setCheckEmail, handleClickNext}) => {
    const {name, email} = userData;
    const {register, handleSubmit, setError, getValues, trigger, formState: {errors}} = useForm();

    /** 중복확인 버튼 클릭 이벤트 */
    const handleCheckEmail = async() => {

        try {
            // 이메일 Field 만 유효성 검사
            const emailState = await trigger('email');
            if(!emailState) return;

            // 입력한 email 정보 가져오기
            let email = getValues('email');
            
            // 이메일등록가능여부 확인 API 연동
            let result = await userAvailable(email);

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }
            
            // API 요청 성공
            // 사용가능한 이메일이 아닐 시
            if(!result.data){
                setError("email", { message: obj.exist_email }, { shouldFocus: true });
                return;
            }

            setCheckEmail(true);
        } catch (error) {
            errorMsg(`${error?.message}`);
            return;
        }
    }

    // 유효성 검사 문구
    const obj = {
        "none": " ",
        "wrong_email": "이메일 형식이 맞지 않습니다. 입력하신 이메일 주소를 다시 한 번 확인해주세요.",
        "exist_email": "이미 사용 중인 이메일 입니다. 다른 이메일을 사용해주세요."
    }

    return (
        <div className='center-area memberInfo'>
            <img className='stepImage' src={step1Image} alt='Step1 이미지'/>
            <div className='explain'>
                <h2>새로운 계정을 만들어보세요.</h2>
                <p>새로운 계정 생성을 위한 필수 정보들을 입력해주세요.</p>
            </div>
            <form className='input-form' onSubmit={handleSubmit((data) => handleClickNext(data, setError))}>
                <div>
                    <div className='input-name'>성함<span>*</span></div>
                    <input 
                        className={errors?.name ? 'input-red' : 'input'}
                        type='text' 
                        placeholder="성함을 입력해주세요." 
                        {...register("name", {
                            required: obj.none,
                            value: name
                        })} 
                    />
                    <span className='text-error'>{errors?.name?.message}</span>
                </div>
                <div>
                    <div className='input-name'>이메일<span>*</span></div>
                    <input 
                        className={errors?.email ? 'input-red' : 'input'}
                        type='text' 
                        placeholder="E-mail을 입력해주세요. (예: aaa@yettiesoft.com)"
                        {...register("email", {
                            required: obj.none,
                            pattern: {
                                value: emailRegExp,
                                message: obj.wrong_email
                            },
                            value: email,
                            onChange: (e) => setCheckEmail(false)
                        })} 
                    />
                    {isCheckEmail ? <span className='email-pass'>사용가능한 이메일 입니다. </span> : <span className='text-error'>{errors?.email?.message}</span>}
                    <span className='check-button' onClick={handleCheckEmail}>중복확인</span>
                </div>
                <button type="submit">다음</button>
            </form>
        </div>
    );
};

export default MemberInfo;