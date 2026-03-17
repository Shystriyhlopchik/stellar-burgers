import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi } from '@api';

type RegisterData = {
  email: string;
  name: string;
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

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка регистрации');
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
        state.user = action.payload.user;
        state.isLoading = false;
        state.errorText = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка регистрации';
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectRegisterError: (state) => state.errorText,
    selectRegisterLoading: (state) => state.isLoading
  }
});

export const { clearError } = userSlice.actions;
export const { selectUser, selectRegisterError, selectRegisterLoading } =
  userSlice.selectors;

export default userSlice.reducer;
