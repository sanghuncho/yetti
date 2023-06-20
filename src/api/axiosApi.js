import axios from 'axios';

const axiosApi = async (option) => {
    // 에러처리 , server_url 필드 없을 경우 / public url 체크
    const deployUrl = await axios.get(`${process.env.PUBLIC_URL}/manifest.json`)
        .then(res=>{return res.data.server_url})
        .catch(err=>{console.log(err); throw err;});
    const BASE_URL = process.env.NODE_ENV === 'production' ? deployUrl : `https://www.yets.io/captain/`;
    
    const instance = axios.create({
        baseURL : BASE_URL,
        withCredentials: true,
        ...option
    });
    return instance;
}

export const api = axiosApi();