import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import wordReducer from '../features/words/wordSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    word: wordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;