import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const data = await getFeedsApi();
  return data.orders;
});

type FeedState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: FeedState = {
  orders: [],
  isLoading: false
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectIsLoading: (state) => state.isLoading
  }
});

export const { selectOrders, selectIsLoading } = feedSlice.selectors;
export default feedSlice.reducer;
