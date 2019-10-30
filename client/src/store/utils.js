import axios from 'axios'
import config from '../config';

export const updateObject = (old_obj, obj_prop) => {
    return {
        ...old_obj,
        ...obj_prop
    }
}

export const axiosInstance = axios.create({
    baseURL: config.SERVER,
    timeout: 5000
});


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        const refresh_token = localStorage.getItem('refresh_token');

        if (refresh_token !== "undefined" && (error.response.status === 401 || error.response.status === 403)) {

            return axiosInstance
                .post('api/token/refresh/', { refresh: refresh_token })
                .then(({ data }) => {
                    console.log(data)
                    localStorage.setItem('access_token', data.access);

                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

                    return axios(originalRequest);
                })
                .catch(err => {
                    console.log(err)
                });
        }

        return Promise.reject(error);
    }
);
