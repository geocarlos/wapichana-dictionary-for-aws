import Amplify, { Auth } from 'aws-amplify';
import axios, { AxiosRequestConfig } from 'axios';
import {AWS_REGION, USER_POOL_ID, APP_CLIENT_ID, API_BASE_SECURE_URL, API_FILE_UPLOAD_URL} from './constants';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: AWS_REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: APP_CLIENT_ID
    }
  });

export const handleSignIn = (username: string, password: string) => {
    return Auth.signIn(username, password)
    .then(user => {
        return Auth.currentSession()
        .then(data => {
            const roles = data.getIdToken().decodePayload()['cognito:groups'];
            return {
                ...user,
                userRoles: roles,
                isLoggedIn: true
            }
        })
    })
    .catch(error => {
        throw error;
    });
}

export const handleSignOut = () => {
    return Auth.signOut();
}

export const checkAuthOnLoad = () => {
    return Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.currentSession()
        .then(data => {
            const roles = data.getIdToken().decodePayload()['cognito:groups'];
            return {
                ...user,
                userRoles: roles,
                isLoggedIn: true
            }
        })
    })
    .catch(error => {
        throw error;    
    })
}

axios.interceptors.request.use((request: AxiosRequestConfig) => {
    if (request.url && !(request.url.includes(API_BASE_SECURE_URL) || request.url.includes(API_FILE_UPLOAD_URL))) {
        return request;
    }

    return Auth.currentSession()
    .then(data => {
        request.headers.Authorization = `Bearer ${data.getIdToken().getJwtToken()}`;
        return request;
    })
    .catch(error => {
        console.log(error);
        return request;
    })
})