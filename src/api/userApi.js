import { api } from "./axiosApi";

/**
 * 회원가입
 * @param {string} email 사용자 이메일
 * @param {string} name 사용자 이름
 * @param {string} password 사용자 비밀번호 : 비밀번호 설정정보 암호화 처리
 */
export const userRegister = async(email, name, password) => {
    
    const data = {
        "email": email, 
        "name": name, 
        "password": password};

    try {
        const result = await (await api).post(
            "user/register",
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 로그인
 * @param {string} email 사용자 이메일
 * @param {string} password 사용자 비밀번호 : 비밀번호 설정정보 암호화 처리
 */
export const userLogin = async(email, password) => {

    const data = {
        "email": email, 
        "password": password
    }

    try {
        const result = await (await api).post(
            "user/login",
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 로그아웃
 */
 export const userLogout = async() => {

    try {
        const result = await (await api).get(
            "user/logout"
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 사용자정보 조회
 */
 export const getUserInfo = async() => {

    try {
        const result = await (await api).get(
            "user/info"
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 이메일등록가능여부확인
 * @param {string} email 사용자 이메일
 */
export const userAvailable = async(email) => {

    try {
        const result = await (await api).get(
            `user/available/${email}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 미로그인사용자비밀번호찾기
 * @param {string} email 등록한 이메일
 */
 export const userReset = async(email) => {

    const data = {
        "email": email
    }

    try {
        const result = await (await api).patch(
            'user/reset',
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 로그인사용자비밀번호확인
 * @param {string} password 기존 비밀번호 : 비밀번호 설정정보 암호화 처리
 */
export const checkUserPassword = async(password) => {

    const data = {
        "password": password
    }

    try {
        const result = await (await api).post(
            "user/validate",
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 로그인사용자정보변경
 * @param {string} name 사용자 이름
 * @param {string} newPassword 새 비밀번호 : 비밀번호 설정정보 암호화 처리
 */
 export const patchUserInfo = async(name, newPassword) => {

    const data = {};
    if (name) data.name = name;
    if (newPassword) data.newPassword = newPassword;

    try {
        const result = await (await api).patch(
            "user/info",
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}


/**
 * 비밀번호암호화설정정보
 */
export const userGuard = async() => {

    try {
        const result = await (await api).get(
            "user/guard"
        );

        return result.data;
    } catch(e) {
        throw e;
    }

}