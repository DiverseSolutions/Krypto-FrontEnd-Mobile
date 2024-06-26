import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './reducer/themeReducer';
import { Store } from 'redux'
import { useDispatch } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

import SearchReducer from './reducer/searchReducer';
import SingleReducer from './reducer/singleReducer';
import CallReactQuery from './reducer/callQueryReducer';
import AuthModalReducer from './reducer/authReducer';
import UserReducer from './reducer/userReducer';
import QuoteReducer from './reducer/quoteReducer';


export const store = configureStore({
    reducer: {
        theme: themeReducer,
        search: SearchReducer,
        single: SingleReducer,
        reactQuery: CallReactQuery,
        auth: AuthModalReducer,
        user: UserReducer,
        quote: QuoteReducer,
    }
})

const initStore = () => store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const wrapper = createWrapper<Store<RootState>>(initStore, {debug: process.env.NODE_ENV === 'development'});