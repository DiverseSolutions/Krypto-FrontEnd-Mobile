const initialState = {
    isChartLoading: true,
    priceChart: [],
    marketcapChart: [],
}

export default function SingleReducer(state = initialState, action) {
    switch(action.type) {
        case 'SINGLE_CHART_LOADING':
            return {
                ...state,
                isChartLoading: action.payload.value
            }
        case 'SINGLE_PRICE_CHART':
            return {
                ...state,
                priceChart: action.payload.value
            }
        case 'SINGLE_MARKETCAP_CHART':
            return {
                ...state,
                marketcapChart: action.payload.value
            }
        default:
            return state;
    }
}