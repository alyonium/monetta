import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './AccountBlockDots.module.css';

type AccountBlockDotsProps = {
  totalPages: number;
  currentPage: number;
  onGoToPage: (index: number) => void;
};

const AccountBlockDots = ({
  totalPages,
  currentPage,
  onGoToPage,
}: AccountBlockDotsProps) => {
  const { t } = useTranslation();

  return (
    <nav className={styles.dots} aria-label={t('budget.pagination.pages')}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          type='button'
          className={clsx(
            styles.dot,
            index === currentPage && styles.dotCurrent,
          )}
          aria-label={t('budget.pagination.page', { page: index + 1 })}
          aria-current={index === currentPage ? true : undefined}
          onClick={() => onGoToPage(index)}
        />
      ))}
    </nav>
  );
};

export default AccountBlockDots;
