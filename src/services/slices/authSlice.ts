import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
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
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  errorText: '',
  isLoading: false,
  isAuthChecked: false
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

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    data: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка обновления профиля');
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Не удалось получить пользователя'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
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
        state.errorText = action.error.message || 'Ошибка регистрации';
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
        state.errorText = action.error.message || 'Ошибка авторизации';
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.errorText = '';
        state.isLoading = false;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectUserError: (state) => state.errorText,
    selectUserLoading: (state) => state.isLoading,
    selectIsAuthChecked: (state) => state.isAuthChecked
  }
});

export const { clearError } = userSlice.actions;
export const {
  selectUser,
  selectUserError,
  selectUserLoading,
  selectIsAuthChecked
} = userSlice.selectors;

export default userSlice.reducer;
