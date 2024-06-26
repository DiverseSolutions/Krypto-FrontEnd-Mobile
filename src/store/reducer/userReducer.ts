import Cookies from "js-cookie"

const initialState = {
    isLoggedIn: false,
    email: null,
    displayName: null,
    userName: null,
    avatarUrl: null,
    accessToken: null
}

export default function UserReducer(state = initialState, action) {
    switch(action.type) {
        case 'USER_LOG_IN':
            return {
                ...state,
                isLoggedIn: true,
                email: action.payload.email || '',
                displayName: action.payload.displayName || '',
                userName: action.payload.userName || '',
                avatarUrl: action.payload.avatarUrl || '',
                accessToken: Cookies.get('accessToken')
            }
        case 'USER_LOG_OUT':
            return {
                ...state,
                isLoggedIn: false,
                email: null,
                displayName: null,
                userName: null,
                avatarUrl: null,
                accessToken: null
            }
        default: 
            return state
    }
}