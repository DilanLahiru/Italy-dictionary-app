import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';

// store
import type {RootState, AppDispatch} from './store';

// hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;