import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserApi, registerUserApi } from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

type RegisterData = {
  email: string;
  name: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export type User = {
  name: string;
  email: string;
};

type UserState = {
  user: User | null;
  errorText: string;
  isLoading: boolean;
};

const initialState: UserState = {
  user: null,
  errorText: '',
  isLoading: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка регистрации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка выхода');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.errorText = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.errorText = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка регистрации';
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.errorText = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка авторизации';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.errorText = '';
        state.isLoading = false;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectUserError: (state) => state.errorText,
    selectUserLoading: (state) => state.isLoading
  }
});

export const { clearError } = userSlice.actions;
export const { selectUser, selectUserError, selectUserLoading } =
  userSlice.selectors;

export default userSlice.reducer;
