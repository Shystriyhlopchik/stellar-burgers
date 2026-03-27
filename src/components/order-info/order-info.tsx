import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { selectUserOrders } from '../../services/slices/profileOrdersSlice';
import {
  getOrderByNumber,
  selectCurrentOrder,
  selectOrders,
  selectOrdersLoading
} from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);

  const feedOrders = useSelector(selectOrders);
  const userOrders = useSelector(selectUserOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectOrdersLoading);

  const orderDataFromStore =
    feedOrders.find((order) => order.number === Number(number)) ||
    userOrders.find((order) => order.number === Number(number));

  useEffect(() => {
    if (number && !orderDataFromStore) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, orderDataFromStore, number]);

  const orderData = orderDataFromStore || currentOrder;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || isLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
