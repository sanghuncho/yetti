import Swal from "sweetalert2"

import '../styles/sweetalert2.scss';

const INFO = "info";
const WARNING = "warning";
const ERROR = "error";
const SUCCESS = "success";
export const SESSIONMESSAGE = "세션이 만료되었습니다. 다시 로그인해 주시기 바랍니다.";

export const iconLevel = {INFO, WARNING, ERROR, SUCCESS};

export const errorMsg = (message) => {
    Swal.fire({
        icon: 'error',
        html:
            '오류가 발생했습니다. 다시 시도해주세요.<br /> ' +
            '오류 지속 시 운영자에게 문의 부탁드립니다. <br /> ' +
            `[ ${message} ]`,
    });
}

export const alertMessage = (iconLevel, message) =>{
    Swal.fire({
        icon: iconLevel,
        text: message,
        allowOutsideClick: true,
        buttonsStyling:true
    });
}
