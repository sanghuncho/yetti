import { api } from "./axiosApi";

/**
 * 알림 등록
 * @param {string} sid 서비스 아이디
 * @param {number} interval 탐지 주기 (10, 60(default), 180)
 * @param {number} count 오류 횟수, default 10
 * @param {object} channel sms와 email
 * @param {object} eventType crash, fatal, nelog
 * @param {string} name 알림 이름
 * @param {string} usermessage 알림 메시지
 */
export const notiInfo = async(params)=>{

    const data = {
        "sid" : params.sid,
        "interval" : params.interval,
        "count" : params.count,
        "channel" : params.channel,
        "crashType" : params.crashType,
        "name" : params.name,
        "usermessage" : params.usermessage,
    };
    try{
        const result = await (await api).post(
            "notification/info",
            data
        );
        return result.data;
    }catch(e){
        throw e;
    }
}

/**
 * 알림 리스트
 */
export const notiList = async()=>{

    try{
        const result = await (await api).get(
            "notification/list"
        );
        return result.data;
    }catch(e){
        throw e;
    }
}

/**
 * 알림 수정
 * @param {string} nid 알림 아이디
 * @param {string} sid 서비스 아이디
 * @param {number} interval 탐지 주기 (10, 60(default), 180)
 * @param {number} count 오류 횟수, default 10
 * @param {object} channel sms와 email
 * @param {object} eventType crash, fatal, nelog
 * @param {string} name 알림 이름
 * @param {string} usermessage 알림 메시지
 * @param {boolean} active 알림 on / off
 */
export const notiModify = async(data)=>{
    try{
        const result = await (await api).patch(
            "notification/modify",
            data
        );
        return result.data;
    }catch(e){
        throw e;
    }
}

/**
 * 알림 삭제
 * @param {string} nid 알림 아이디
 */
export const notiDelete = async(nid)=>{

    const data = {
        "nid": nid
    }
    try{
        const result = await (await api).delete(
            `notification/info?nid=${nid}`,
            data);
        return result.data;
    }catch(e){
        throw e;
    }
}