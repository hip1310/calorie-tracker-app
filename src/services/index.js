import axios from 'axios';
import { CONSTANTS } from '../utils/constants';

axios.defaults.headers.common['Authorization'] = `Bearer ${CONSTANTS.USER_TOKEN}`;

export const axiosAPI = axios.create({
    baseURL: CONSTANTS.BASE_URL,
    parse: true
});
