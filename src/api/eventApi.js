import { api } from "./axiosApi";
import {getUTCTime, getWeekSeconds} from "../utils/time";

/**
 * 이벤트검색조건리스트
 */
 export const eventSearchConditions = async() => {

    try {
        const result = await (await api).get(
            `event/search-conditions`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 이벤트검색
 * @param {string array} serviceName 서비스 이름
 * @param {string array} eventType 오류(이벤트) 이름
 * @param {string array} device 기기정보
 * @param {string array} os os 정보
 * @param {string array} crashType 이벤트 타입
 * @param {number} start 조회기간_시작
 * @param {number} end 조회기간_끝
 * @param {string} id 이벤트ID
 * @param {number} cnt 불러올 이벤트 개수
 */
 export const eventSearch = async(serviceName, eventType, device, os, crashType, start, end, id, cnt) => {

    // 조회 기간
    const period = {
        "start": start !== 0 ? new Date(start).getTime() + getUTCTime() : new Date().getTime() + getUTCTime(),
        "end": end !== 0 ? new Date(end).getTime()  + getUTCTime() : start + (getWeekSeconds() - 1000)  + getUTCTime()
    }

    // 검색 조건
    const filter = {
        "serviceName": serviceName ?? [], 
        "eventType": eventType ?? [],
        "device": device ?? [], 
        "os": os ?? [], 
        "crashType": crashType ?? [],
        "period": period ?? [],
        "lastID":id,
        "cnt":cnt
    };

    const data = {
        "filter": filter
    }

    try {
        const result = await (await api).post(
            "event/search",
            data
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 이벤트상세정보
 * @param {string} id 이벤트ID
 * @param {boolean} detail info.crash.threads 마지막 데이터만 출력 여부
 */
 export const eventDetailList = async(id, detail) => {

    try {
        const result = await (await api).get(
            `event/detail-list/${id}/${detail}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}

/**
 * 이벤트요약정보
 * @param {string} id 이벤트ID
 */
 export const eventSummaryInfo = async(id) => {

    try {
        const result = await (await api).get(
            `event/summary-info/${id}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }
    
}

/**
 * 이벤트 차트 데이터
 * @param {number} start start date
 * @param {number} end end date
 * @param {string array} serviceName 서비스 이름
 * @param {string array} eventType 크래쉬 발생 영역, 언어
 * @param {string array} device 기기정보
 * @param {string array} os os 정보
 * @param {string array} crashType 이벤트 타입
 */
 export const eventChartInfo = async(start, end, serviceName, eventType, device, os, crashType ) => {

    // 검색 조건
    const conditions = {
        "serviceName": serviceName ?? [], 
        "eventType": eventType ?? [],
        "device": device ?? [], 
        "os": os ?? [], 
        "crashType": crashType ?? [],
    };

    // 조회 기간
    const body = {
        "start": start + getUTCTime(),
        "end": end + getUTCTime(),
        conditions
    };

    try {
        const result = await (await api).post(
            "event/chart",
            body
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}


/**
 * 이벤트 필터 데이터
 */
export const eventFilterList = async(start,end) => {

    let startD = start + getUTCTime();
    let endD = end + getUTCTime();
    
    try {
        const result = await (await api).get(
            `event/filter?start=${startD}&end=${endD}`
        );
        return result.data;
    } catch(e) {
        throw e;
    }

}
