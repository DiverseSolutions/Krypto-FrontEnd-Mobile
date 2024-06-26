const initialState = {
    isCallWatchlist: false,
    isCallProfile: false
}

export default function CallReactQuery(state = initialState, action) {
    switch(action.type) {
        case 'CALL_WATCHLIST':
            return {
                ...state,
                isCallWatchlist: action.payload.value
            }
        case 'CALL_PROFILE':
            return {
                ...state,
                isCallProfile: action.payload.value
            }
        default:
            return state
    }
}