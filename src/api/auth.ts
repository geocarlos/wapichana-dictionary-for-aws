import Amplify, { Auth } from 'aws-amplify';
import {AWS_REGION, USER_POOL_ID, APP_CLIENT_ID} from './constants';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: AWS_REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: APP_CLIENT_ID
    }
  });

export const handleSignIn = (username: string, password: string) => {
    return Auth.signIn(username, password);
}

export const handleSignOut = () => {
    return Auth.signOut();
}