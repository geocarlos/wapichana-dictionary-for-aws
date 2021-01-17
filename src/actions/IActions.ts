import { Action } from "redux";
import keys from "./ActionTypeKeys";

export interface IFetchEntries extends Action {
    readonly type: keys.FETCH_ENTRIES,
    readonly payload: Promise<any>
}

export interface IFetchEntriesResolved extends Action {
    readonly type: keys.FETCH_ENTRIES_RESOLVED,
    readonly payload: any
}

export interface ICreateEntry extends Action {
    readonly type: keys.CREATE_ENTRY,
    readonly payload: Promise<any>
}

export interface ICreateEntryResolved extends Action {
    readonly type: keys.CREATE_ENTRY_RESOLVED,
    readonly payload: any
}

export interface IFetchEntry {
    readonly type: keys.FETCH_ENTRY,
    readonly payload: Promise<any>
}

export interface IFetchEntryResolved {
    readonly type: keys.FETCH_ENTRY_RESOLVED,
    readonly payload: any
}

export interface IDeleteEntry {
    readonly type: keys.DELETE_ENTRY,
    readonly payload: Promise<any>
}

export interface IDeleteEntryResolved {
    readonly type: keys.DELETE_ENTRY_RESOLVED,
    readonly payload: any
}

export interface IFetchUsers extends Action {
    readonly type: keys.FETCH_USERS,
    readonly payload: Promise<any>
}

export interface IFetchUsersResolved extends Action {
    readonly type: keys.FETCH_USERS_RESOLVED,
    readonly payload: any
}

export interface ICreateUser extends Action {
    readonly type: keys.CREATE_USER,
    readonly payload: Promise<any>
}

export interface ICreateUserResolved extends Action {
    readonly type: keys.CREATE_USER_RESOLVED,
    readonly payload: any
}

export interface IFetchUser {
    readonly type: keys.FETCH_USER,
    readonly payload: Promise<any>
}

export interface IFetchUserResolved {
    readonly type: keys.FETCH_USER_RESOLVED,
    readonly payload: any
}

export interface IDeleteUser {
    readonly type: keys.DELETE_USER,
    readonly payload: Promise<any>
}

export interface IDeleteUserResolved {
    readonly type: keys.DELETE_USER_RESOLVED,
    readonly payload: any
}


export interface ISignIn {
    readonly type: keys.SIGN_IN | keys.SIGN_IN_REJECTED,
    readonly payload?: Promise<any>
}

export interface ISignInResolved {
    readonly type: keys.SIGN_IN_RESOLVED,
    readonly payload: any
}

export interface ISignOut {
    readonly type: keys.SIGN_OUT | keys.SIGN_OUT_REJECTED,
    readonly payload: Promise<any>
}

export interface ISignOutResolved {
    readonly type: keys.SIGN_OUT_RESOLVED,
    readonly payload: any
}