import { getStorage, removeStorage } from './storage';
import { alertMessage, iconLevel, SESSIONMESSAGE } from './message';
import { logout } from '../redux/actions/user';

export const isLogin = () => {
    return getStorage('login');
};


export const checkLogin = (dispatch, result) => {
    // code -1010 : 로그인 세션 만료 / 로그인 상태 X
    if (result === -1010) {
        // 로그인 정보 제거
        dispatch(logout);
        removeStorage('login');

        // 로그인 화면으로 이동
        // alertMessage(iconLevel.WARNING, SESSIONMESSAGE);
        return false;
    }
    return true;
}
