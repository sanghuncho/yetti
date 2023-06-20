import React from 'react';
import { useForm } from 'react-hook-form';
import { passwordRegExp } from '../../../libs/regex';

// Images
import step2Image from '../../../assets/images/join_images/img_step02.png';

const Confirm = ({userData, handleClickNext}) => {

    const {password, checkPassword} = userData;
    const {register, handleSubmit, setError, formState: {errors}} = useForm();

    // 유효성 검사 문구
    const obj = {
        "none": " ",
        "wrong_password": "비밀번호는 8자리 이상 영문, 숫자, 특수문자가 포함되어야 합니다. ",
    }

    return (
        <div className='center-area confirm'>
            <img className='stepImage' src={step2Image} alt="Step2 이미지"/>
            <div className='explain'>
                <h2>비밀번호를 입력해주세요.</h2>
                <p>로그인에 사용할 비밀번호를 설정합니다.</p>
            </div>
            <form className='input-form' onSubmit={handleSubmit((data) => handleClickNext(data, setError))}>
                <div>
                    <div className='input-name'>비밀번호<span>*</span></div>
                    <input 
                        className={errors?.password ? 'input-red' : 'input'}
                        type='password' 
                        placeholder="로그인에 사용할 비밀번호를 입력해주세요." 
                        maxLength="15"
                        {...register("password", {
                            required: obj.none,
                            pattern: {
                                value: passwordRegExp,
                                message: obj.wrong_password,
                            },
                            value: password
                        })} 
                    />
                    <span className='text-error'>{errors?.password?.message}</span>
                </div>
                <div>
                    <div className='input-name'>비밀번호 확인<span>*</span></div>
                    <input 
                        className={errors?.checkPassword ? 'input-red' : 'input'}
                        type='password' 
                        placeholder="비밀번호를 다시 한 번 입력해주세요."
                        maxLength="15"
                        {...register("checkPassword", {
                            required: obj.none,
                            value: checkPassword
                        })} 
                    />
                    <span className='text-error'>{errors?.checkPassword?.message}</span>
                </div>
                <button type="submit">다음</button>
            </form>
        </div>
    );
};

export default Confirm;