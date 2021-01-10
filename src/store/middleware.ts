import ActionTypes from "../actions/ActionTypes";

const handleAsyncAction = (store: any) => (next: any) => (action: ActionTypes) => {
    if (action.payload instanceof Promise) {
        store.dispatch({type: action.type + '_PENDING'});
        return action.payload
        .then(data => {
            store.dispatch({type: action.type + '_RESOLVED', payload: data});
            return data;
        })
        .catch(error => {
            store.dispatch({type: action.type + '_REJECTED', payload: error});
            throw error;
        });
    }
    next(action);
}

export default handleAsyncAction;