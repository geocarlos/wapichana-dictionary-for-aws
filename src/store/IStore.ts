import Entry from "../model/Entry";
import User from "../model/User";

export default interface IStore {
    entries: Array<Entry>;
    user: User | null;
    users: Array<User> | null;
    loading: boolean;
}