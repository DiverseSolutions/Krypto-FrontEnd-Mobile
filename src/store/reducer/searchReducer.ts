const initialState = {
    value: null
}

export default function HomeSearchReducer(state = initialState, action) {
    switch(action.type) {
        case 'SEARCH_CHANGE':
            return {
                value: action.payload.value
            }
        default:
            return state;
    }
}