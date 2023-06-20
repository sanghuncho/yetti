import { getUTCTime } from "../utils/time";
import { api } from "./axiosApi";

/**
 * 서비스 추가
 * @param {string} name 서비스 이름
 */
 export const postServiceInfo = async(name) => {

    const data = {
        "name": name
    }

    try {
        const result = await (await api).post(
            "service/info",
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 서비스 삭제
 * @param {string} id 서비스ID
 */
 export const deleteServiceInfo = async(id) => {

    try {
        const result = await (await api).delete(
            `service/info/${id}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 서비스 리스트
 */
 export const getServiceList = async() => {

    try {
        const result = await (await api).get(
            'service/list'
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 서비스조회권한사용자조회
 * @param {number} id 서비스ID
 */
 export const servicePermissionList = async(id) => {

    try {
        const result = await (await api).get(
            `service/permission-list/${id}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 서비스조회권한사용자추가
 * @param {string} id 서비스 id
 * @param {string} email 추가할 사용자 메일
 */
 export const postServicePermission = async(id, email) => {

    const data = {
        "id": id, 
        "email": email
    };

    try {
        const result = await (await api).post(
            'service/permission',
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }
}

/**
 * 서비스조회권한사용자삭제
 * @param {number} shId share id
 * @param {number} sid 서비스 id
 */
 export const deleteServicePermission = async(shId, sid) => {

    const params = {
        "shId": shId, 
        "sid": sid
    };

    try {
        const result = await (await api).delete(
            'service/permission',
            {params: params}
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}


/**
 * 서비스통계/리포트
 * @param {number array} ids 서비스 id 배열
 * @param {number} start 조회기간_시작
 * @param {number} end 조회기간_끝
 */
 export const serviceReport = async(infos, start, end) => {
    // 조회 기간
    const turn = {
        "start": start.getTime()+getUTCTime(), 
        "end": end.getTime()+getUTCTime()
    };

    const data = {
        "infos": infos, 
        "turn": turn
    };

    try {
        const result = await (await api).post(
            'service/report',
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 저장된 로그 용량 삭제
 * @param {number array} ids 서비스 id 배열
 */
export const deleteLog = async(sid) => {

    try {
        const result = await (await api).delete(
            `service/log?id=${sid}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}