import * as i from './IActions';

type ActionTypes = i.IFetchEntries | i.IFetchEntriesResolved |
i.IFetchEntry | i.IFetchEntryResolved |
i.ICreateEntry | i.ICreateEntryResolved |
i.IDeleteEntry | i.IDeleteEntryResolved | 
i.IFetchUsers | i.IFetchUsersResolved |
i.IFetchUser | i.IFetchUserResolved |
i.ICreateUser | i.ICreateUserResolved |
i.IDeleteUser | i.IDeleteUserResolved |
i.ISignIn | i.ISignInResolved |
i.ISignOut | i.ISignOutResolved;

export default ActionTypes;