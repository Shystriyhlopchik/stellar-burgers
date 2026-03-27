import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  errorText: string;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  errorText: ''
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientsIds);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ошибка оформления заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData(state) {
      state.orderModalData = null;
      state.errorText = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.errorText = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.errorText =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка оформления заказа';
      });
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderError: (state) => state.errorText
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export const { selectOrderRequest, selectOrderModalData, selectOrderError } =
  orderSlice.selectors;

export default orderSlice.reducer;
