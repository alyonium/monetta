import { Navigate, Route, Routes } from 'react-router';
import AppLayout from '@/components/AppLayout/AppLayout.tsx';
import RequireAuth from '@/components/RequireAuth/RequireAuth.tsx';
import { BASE_PATH, ROUTE } from '@/constants/router.ts';
import Analytics from '@/modules/analytics/Analytics.tsx';
import Budget from '@/modules/budget/Budget.tsx';
import History from '@/modules/history/History.tsx';
import Login from '@/modules/login/Login.tsx';
import Settings from '@/modules/settings/Settings.tsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTE.LOGIN} element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTE.BUDGET} element={<Budget />} />
          <Route path={ROUTE.HISTORY} element={<History />} />
          <Route path={ROUTE.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTE.SETTINGS} element={<Settings />} />
        </Route>
      </Route>
      <Route path={BASE_PATH} element={<Navigate to={ROUTE.BUDGET} replace />} />
      <Route path='*' element={<Navigate to={ROUTE.BUDGET} replace />} />
    </Routes>
  );
};

export default AppRouter;
