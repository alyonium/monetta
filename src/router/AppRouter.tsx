import { Route, Routes } from 'react-router';
import Budget from '@/modules/budget/Budget.tsx';
import Login from '@/modules/login/Login.tsx';
import { ROUTE } from '@/constants/router.ts';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTE.LOGIN} element={<Login />} />
      <Route path={ROUTE.BUDGET} element={<Budget />} />
    </Routes>
  );
};

export default AppRouter;
