import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false
};

export const fetchUserOrders = createAsyncThunk(
  'profileOrders/fetchUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data.orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    selectUserOrders: (state) => state.orders,
    selectUserOrdersLoading: (state) => state.isLoading
  }
});

export const { selectUserOrders, selectUserOrdersLoading } =
  profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
