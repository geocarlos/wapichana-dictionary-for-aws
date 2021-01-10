import ActionTypeKeys from "./ActionTypeKeys";
import { ICreateUser, IDeleteUser, IFetchUsers, ISignIn, ISignOut } from "./IActions";

export const signIn = (username: string, password: string): ISignIn => ({
    type: ActionTypeKeys.SIGN_IN,
    payload: Promise.resolve({username, password})
});

export const signOut = (): ISignOut => ({
    type: ActionTypeKeys.SIGN_OUT,
    payload: Promise.resolve(true)
});

export const fetchUsers = (): IFetchUsers => ({
    type: ActionTypeKeys.FETCH_USERS,
    payload: Promise.resolve(true)
});

export const createUser = (username: string): ICreateUser => ({
    type: ActionTypeKeys.CREATE_USER,
    payload: Promise.resolve(username)
});

export const deleteUser = (username: string): IDeleteUser => ({
    type: ActionTypeKeys.DELETE_USER,
    payload: Promise.resolve(username)
});