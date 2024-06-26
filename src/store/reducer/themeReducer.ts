import Cookie from 'js-cookie'


type ThemeMode = 'light' | 'dark'

export interface ThemeState {
    mode: ThemeMode
}

const initialState: ThemeState = {
    mode: 'dark'
}

interface ThemeAction {
    type: 'THEME_CHANGE',
    payload: {
        mode: ThemeMode
    }
}


export default function themeReducer(state = initialState, action: ThemeAction): ThemeState {
    let root
    
    switch(action.type) {
        case 'THEME_CHANGE':
            if (action.payload.mode === 'dark') {
                root = window.document.documentElement
                root.classList.remove('light')
                root.classList.add('dark')
                Cookie.set('theme', 'dark')
            } else {
                root = window.document.documentElement
                root.classList.remove('dark')
                root.classList.add('light')
                Cookie.set('theme', 'light')
            }
            return {
                mode: action.payload.mode
            }
        default:
            return state
    }
}