import { Amplify } from 'aws-amplify';
import { signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { AWS_REGION, USER_POOL_ID, APP_CLIENT_ID, API_BASE_SECURE_URL, API_FILE_UPLOAD_URL } from './constants';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: USER_POOL_ID,
            userPoolClientId: APP_CLIENT_ID
        }
    }
});

export const handleSignIn = async (username: string, password: string) => {
    const result = await amplifySignIn({ username, password });
    if (result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        return { challengeName: 'NEW_PASSWORD_REQUIRED', username };
    }
    const session = await fetchAuthSession();
    const roles = (session.tokens?.idToken?.payload['cognito:groups'] as string[]) || [];
    return {
        username,
        userRoles: roles,
        isLoggedIn: true
    };
};

export const handleSignOut = () => {
    return amplifySignOut();
};

export const checkAuthOnLoad = async () => {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    const roles = (session.tokens?.idToken?.payload['cognito:groups'] as string[]) || [];
    return {
        username: user.username,
        userRoles: roles,
        isLoggedIn: true
    };
};

axios.interceptors.request.use(async (request: InternalAxiosRequestConfig) => {
    if (request.url && !(request.url.includes(API_BASE_SECURE_URL) || request.url.includes(API_FILE_UPLOAD_URL))) {
        return request;
    }

    try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) {
            request.headers.set('Authorization', `Bearer ${idToken}`);
        }
    } catch (error) {
        console.log(error);
    }
    return request;
});
