import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

type OrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async () => await getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload ?? null;
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrdersLoading: (state) => state.isLoading,
    selectCurrentOrder: (state) => state.currentOrder,
    selectIsFeed: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    })
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const {
  selectOrders,
  selectOrdersLoading,
  selectIsFeed,
  selectCurrentOrder
} = ordersSlice.selectors;
export default ordersSlice.reducer;
