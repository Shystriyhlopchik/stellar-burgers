import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type OrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: OrdersState = {
  orders: [],
  isLoading: false
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectIsLoading: (state) => state.isLoading
  }
});

export const { selectOrders, selectIsLoading } = ordersSlice.selectors;
export default ordersSlice.reducer;
