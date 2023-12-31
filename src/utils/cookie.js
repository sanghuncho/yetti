import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, option) => {
    cookies.set(name, value, {...option});
}

export const getCookie = (name) => {
    return cookies.get(name);
}

export const removeCookie = (name, option) => {
    cookies.remove(name, {...option});
}