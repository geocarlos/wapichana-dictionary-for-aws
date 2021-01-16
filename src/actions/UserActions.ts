import { handleSignIn, handleSignOut } from "../api/auth";
import ActionTypeKeys from "./ActionTypeKeys";
import { ICreateUser, IDeleteUser, IFetchUsers, ISignIn, ISignOut } from "./IActions";

export const signIn = (username: string, password: string): ISignIn => ({
    type: ActionTypeKeys.SIGN_IN,
    payload: handleSignIn(username, password)
});

export const signOut = (): ISignOut => ({
    type: ActionTypeKeys.SIGN_OUT,
    payload: handleSignOut()
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