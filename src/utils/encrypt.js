import guardrail_client from '../thirdparty/guardrail_client.js';
import { userGuard } from '../api/userApi';

// 로그인 시 암호화
export const encrypt = async(password) => {
    // 비밀번호암호화설정정보 API 연동
    const result = await userGuard();

    const guard = new guardrail_client(result.data);
    const encryptPw = await guard.authUser(password);

    return encryptPw;
}

// 회원가입 시 암호화
export const joinEncrypt = async(password) => {
    // 비밀번호암호화설정정보 API 연동
    const result = await userGuard();

    const guard = new guardrail_client(result.data);
    const encryptPw = await guard.newUser(password);

    return encryptPw;
}

// 비밀번호 변경 암호화
export const changeInfoEncrypt = async(password, newPassword) => {
    // 비밀번호암호화설정정보 API 연동
    const result = await userGuard();

    const guard = new guardrail_client(result.data);
    const encryptPw = await guard.authUser(password);
    const encryptNewPw = await guard.newUser(newPassword);

    return {password: encryptPw, newPassword: encryptNewPw};
}