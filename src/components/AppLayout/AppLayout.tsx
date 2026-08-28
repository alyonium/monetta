import { clsx } from 'clsx';
import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FOOTER_TABS } from '@/components/AppLayout/constants.ts';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <nav className={styles.nav}>
          {FOOTER_TABS.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  clsx(styles.tab, isActive && styles.active)
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                    <span>{t(tab.labelKey)}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </footer>
    </div>
  );
};

export default AppLayout;
