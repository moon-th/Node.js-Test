import axios from 'axios';
import {
    LOGIN_USER ,REGISTER_USER
} from './types';

export function loginUser(dataTouSubmit){

    const request = axios.post('/api/users/login',dataTouSubmit)
    .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload : request
    }
}

export function registerUser(dataTouSubmit){

    const request = axios.post('/api/users/register',dataTouSubmit)
    .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload : request
    }

}