import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../../entities/user/ui/ProtectedRoute';
import { useSelector } from 'react-redux';
import { getUser, selectIsAuthChecked } from '../../services/slices/authSlice';
import { useDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import React, { useEffect } from 'react';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);

  const closeModal = () => navigate(-1);

  useEffect(() => {
    if (getCookie('accessToken')) {
      dispatch(getUser());
    }
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={closeModal} title={''}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={closeModal} title={''}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal onClose={closeModal} title={''}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
