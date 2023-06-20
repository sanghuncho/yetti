import React from 'react';
import routes from '../../../libs/routes';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { emailRegExp } from '../../../libs/regex';
import { userAvailable, userReset } from '../../../api/userApi';
import { endLoading, startLoading } from '../../../redux/actions/loading';
import { useDispatch } from 'react-redux';
import { errorMsg } from '../../../utils/message';
import { userGuard } from '../../../api/userApi';

const InputEmail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {register, handleSubmit, setError, formState : {errors}} = useForm();

    /** 이메일 전송 버튼 클릭 이벤트 */
    const handleSendEmail = async(data) => {

        dispatch(startLoading());

        try {
            // 이메일등록가능여부 확인 API 연동
            let result1 = await userAvailable(data.email);

            // code 0 이 아님 : API 요청 실패
            if(result1.code !== 0) {
                errorMsg(result1.message);
                dispatch(endLoading());
                return;
            }
    
            // API 요청 성공
            // 사용가능한 이메일이 아닐 시
            if(result1.data){
                setError("email", { message: "등록된 이메일이 아닙니다. " }, { shouldFocus: true });
                dispatch(endLoading());
                return;
            }

            // 미로그인사용자 비밀번호 찾기 API 연동
            let result2 = await userGuard();

            // code 0 이 아님 : API 요청 실패
            if(result2.code !== 0) {
                errorMsg(result2.message);
                dispatch(endLoading());
                return;
            }

            // 미로그인사용자 비밀번호 찾기 API 연동
            let result3 = await userReset(data.email);

            // code 0 이 아님 : API 요청 실패
            if(result3.code !== 0) {
                errorMsg(result3.message);
                dispatch(endLoading());
                return;
            }

            // API 요청 성공
            navigate(routes.findPassword + '/resetPassword');
            
        } catch (error) {
            console.log(error);
            errorMsg(`${error?.message}`);
            return;
        } finally {
            dispatch(endLoading());
        }
    }

    // 유효성 검사 문구
    const obj = {
        "none": " ",
        "wrong_email": "이메일 형식이 맞지 않습니다. 입력하신 이메일 주소를 다시 한 번 확인해주세요.",
    }

    return (
        <div className='center-area inputEmail'>
            <div className='explain'>
                <h2>비밀번호를 잊으셨나요?</h2>
                <p>비밀번호를 재설정하려는 계정(이메일)을 입력하세요.</p>
            </div>
            <form onSubmit={handleSubmit(handleSendEmail)}>
                <input 
                    className={errors?.email ? 'input-red' : 'input'}
                    type="text" 
                    placeholder="E-mail 주소를 입력해주세요."
                    {...register("email", {
                        required: obj.none,
                        pattern: {
                            value: emailRegExp,
                            message: obj.wrong_email,
                        }
                    })}
                />
                <span className='text-error'>{errors?.email?.message}</span>
                <button type='submit'>이메일 전송</button>
            </form>
        </div>
    );
};

export default InputEmail;