const initialState = {
    isForeignQuote: false
}

export default function QuoteReducer(state = initialState, action) {
    switch (action.type) {
        case "FOREIGN_QUOTE":
            return {
                ...state, 
                isForeignQuote: true
            }
        case "LOCAL_QUOTE":
            return {
                ...state, 
                isForeignQuote: false
            }
        default:
            return state
    }
}