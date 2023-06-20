// 랜덤 문자열 생성
export const multilineStr = (str, linesize) => {
    if(str == null) return;
    let newData = '';
    for (let i = 0; i < str.length; i+=linesize) {
        newData += (str.substring(i, i+linesize) + '\n');
      }
    return newData;
}