const initialState = {
    isShowLoginModal: false,
    isShowSignupModal: false,
    isShowForgotModal: false,
    isShowResetModal: false
}

export default function AuthModalReducer(state = initialState, action) {
    switch(action.type) {
        case 'SHOW_LOGIN_MODAL':
            return {
                ...state,
                isShowLoginModal: action.payload.value
            }
        case 'SHOW_SIGNUP_MODAL':
            return {
                ...state,
                isShowSignupModal: action.payload.value
            }
        case 'SHOW_FORGOT_MODAL':
            return {
                ...state,
                isShowForgotModal: action.payload.value
            }
        case 'SHOW_RESET_MODAL':
            return {
                ...state,
                isShowResetModal: action.payload.value
            }
        default: 
            return state
    }
}