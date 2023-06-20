/**
 * begin과 end 사이의 날짜를 배열로 만들어줍니다. 
 * @param begin  시작일
 * @param end  종료일
 * @returns  날짜(timestamp)의 배열
 */
export function generateTimeTable (begin: Date, end: Date): Array<number> {
    const table:number[] = [];
    const thisTime = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate());
    const finalTime = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    while (thisTime <= finalTime) {
        table.push(thisTime.getTime());

        thisTime.setDate(thisTime.getDate() + 1);
    }
    return table;
}

export const utcTimeToLocalTime = (utcTime:number) => {
    const ut = new Date(utcTime)
    const lt = new Date(utcTime + ut.getTimezoneOffset() * 60 * 1000);

    // console.log(`UTC to Local Time (from:${ut} to:${lt})`);
    return lt;
}
/** 
 * YYYY/MM/DD 형식으로 출력 
 * @Param (lnog) long 형식의 time
 */
export const dateTime = (time:number) => {
    const date = new Date(time);

    const year = date.getFullYear().toString();   // 연도
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1).toString();    // 월
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();   // 일
    return `${year}/${month}/${day}`;
}

/** 
 * YYYY-MM-DD hh:mm:ss 형식으로 출력 
 * @Param (long) long 형식의 time
 */
 export const secondTime = (time:number) => {
    const date = new Date(time);

    const year = date.getFullYear().toString();   // 연도
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1).toString();    // 월
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();   // 일
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours().toString();   // 시간
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes().toString();   // 분
    const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds().toString();   // 초
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/** 
 * 날짜 계산 함수(몇분 전, 몇시간 전) 
 * @Param (long) long 형삭의 time
 */
export const detailDate = (time:number) => {

    const now = new Date();
    const milliSeconds = now.getTime() - time;

    if (milliSeconds < getDaySeconds()) {
        const seconds = milliSeconds / 1000;
        if (seconds < 60) return `방금 전`;

        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`;

        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`;
    }

    const dateTime = new Date(time);
    const dateYear = dateTime.getFullYear();
    const thisYear = now.getFullYear();
    if(dateYear !== thisYear) return `${thisYear - dateYear}년 전`;

    const dateMonth = dateTime.getMonth();
    const thisMonth = now.getMonth();
    if(dateMonth !== thisMonth) return `${thisMonth - dateMonth}달 전`;

    const dateDays = dateTime.getDate();
    const thisDays = now.getDate();
    if(dateDays !== thisDays){
        const diffDays = thisDays - dateDays;
        const diffWeeks = Math.floor(diffDays/7);
        if(diffWeeks > 0){
            return `${Math.floor(diffWeeks)}주 전`
        }
        return `${diffDays}일 전`
    }

};

const milliSeconds = 1000;
const seconds = 60;
const minutes = 60;
const days = 24;
const weeks = 7;
const months = 30;

/**
 * 오늘 날짜의 23:59:59 시간 반환
 */
export const getToday = () => {
    return new Date().setHours(23, 59, 59);
};

/**
 * 하루 시간 반환
 */
export const getDaySeconds = () => {
    return milliSeconds * seconds * minutes * days;
};

/**
 * 일주일 시간 반환
 */
export const getWeekSeconds = () => {
    return milliSeconds * seconds * minutes * days * weeks;
};

/**
 * 한달(30일) 시간 반환
 */
export const getMonthSeconds = () => {
    return milliSeconds * seconds * minutes * days * months;
};

/**
 * UTC 시간 계산
 */
export const getUTCTime = () => {
    return (new Date()).getTimezoneOffset()*(-60*1000);
};

