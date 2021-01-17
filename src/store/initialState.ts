import IStore from "./IStore";

const initialState: IStore = {
    entries: [],
    user: {username: '', isLoggedIn: null, userRoles: []},
    users: null,
    loading: false
}

export default initialState;