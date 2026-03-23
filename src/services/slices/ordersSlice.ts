import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type OrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
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
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
        state.isLoading = false;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectIsLoading: (state) => state.isLoading,
    selectIsFeed: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    }),
    selectUserOrders: (state) => state.orders
  }
});

export const { selectOrders, selectIsLoading, selectIsFeed } =
  ordersSlice.selectors;
export default ordersSlice.reducer;
