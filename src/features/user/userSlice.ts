import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseUrl, API_PATH } from '../../utils/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  user: object | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
    const response = await BaseUrl.post(`${API_PATH.AUTH.SIGN_IN}`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;     
    } catch (error: any) {
      rejectWithValue(error.response.data);
    }
  },
); 

export const RegisterUser = createAsyncThunk(
  'user/RegisterUser',
  async (credentials: {username: string, email: string; password: string }, { rejectWithValue }) => {
    try {
    const response = await BaseUrl.post(`${API_PATH.AUTH.SIGN_UP}`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;     
    } catch (error: any) {
      rejectWithValue(error.response.data);
    }
  },
);

export const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async (credentials: {currentPassword: string, password: string; passwordConfirmation: string }, { rejectWithValue }) => {
    try {
    const response = await BaseUrl.post(`${API_PATH.USERS.UPDATE_PASSWORD}`, credentials, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    });
    console.log(response.data);
    return response.data;     
    } catch (error: any) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      rejectWithValue(error.response.data);
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        // Handle token that might be JSON stringified
        const token = typeof action.payload.jwt === 'string' ? action.payload.jwt : JSON.stringify(action.payload.jwt);
        AsyncStorage.setItem('authToken', token);
        AsyncStorage.setItem('userData', JSON.stringify(action.payload.user));
      });
      builder.addCase(RegisterUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        // Handle token that might be JSON stringified
        const token = typeof action.payload.jwt === 'string' ? action.payload.jwt : JSON.stringify(action.payload.jwt);
        AsyncStorage.setItem('authToken', token);
        AsyncStorage.setItem('userData', JSON.stringify(action.payload.user));
      });
    },
});

export default userSlice.reducer;