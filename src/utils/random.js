// 랜덤 문자열 생성
export const randomStr = () => {
    let randomId = (Math.random() + 1).toString(36).substring(7);

    return randomId;
}