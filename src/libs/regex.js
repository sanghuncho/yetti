// 숫자만
export const onlyNumberRegExp = /[0-9]/g;
export const onlyNumberRegExpReplace = /[^0-9]/g;

// 비밀번호 8~15자리 영문+숫자+특수문자
export const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
// 이메일
export const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
// 숫자 3자리 단위
export const threeDigitRegExp = /\B(?=(\d{3})+(?!\d))/g;

/** 
 * 숫자 3자리씩 구분(쉼표 표시)하는 함수
 * @param number 구분할 숫자
 */
export function NumberWithComma(number) {
  const parts = String(number).split(".");
  parts[0] = parts[0].replace(threeDigitRegExp, ",");
  return parts.join(".");
}

/**
 * KB를 GB로 단위 변환 수식
 * @param {number} kbData KB단위의 데이터
 */
export function KbToGb(kbData) {
  // 소수점 넷째자리에서 반올림

  let gbData = kbData/1024/1024;
  return Math.round(gbData * 1000) / 1000;
}