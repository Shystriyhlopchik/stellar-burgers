import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { selectUser, User } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser) as User | undefined;

  return <AppHeaderUI userName={user?.name} />;
};
