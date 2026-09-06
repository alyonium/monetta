import { useRef } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ICON_SIZE } from '@/modules/budget/constants.ts';
import type { AccountBlockViewportHandle } from '@/modules/budget/types/accountBlockViewportHandle.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import AccountBlockDots from './AccountBlockDots/AccountBlockDots.tsx';
import AccountBlockViewport from './AccountBlockViewport/AccountBlockViewport.tsx';
import { useAccountBlockPager } from './useAccountBlockPager.ts';
import styles from './AccountBlockPager.module.css';

type AccountBlockPagerProps = {
  accounts: BudgetAccount[];
};

const AccountBlockPager = ({ accounts }: AccountBlockPagerProps) => {
  const { t } = useTranslation();
  const carouselRef = useRef<AccountBlockViewportHandle>(null);
  const {
    viewportRef,
    items,
    columns,
    currentPage,
    totalPages,
    showArrows,
    goNext,
    goPrev,
    goToPage,
  } = useAccountBlockPager(accounts);

  return (
    <div className={styles.pager}>
      <div className={styles.row}>
        {showArrows && (
          <button
            type='button'
            className={styles.arrow}
            aria-label={t('budget.pagination.previous')}
            onClick={() => carouselRef.current?.slidePrev()}
          >
            <CaretLeftIcon size={ACCOUNT_ICON_SIZE} aria-hidden />
          </button>
        )}

        <AccountBlockViewport
          carouselRef={carouselRef}
          sizeRef={viewportRef}
          items={items}
          columns={columns}
          pageIndex={currentPage}
          onNext={goNext}
          onPrev={goPrev}
          onJump={goToPage}
        />

        {showArrows && (
          <button
            type='button'
            className={styles.arrow}
            aria-label={t('budget.pagination.next')}
            onClick={() => carouselRef.current?.slideNext()}
          >
            <CaretRightIcon size={ACCOUNT_ICON_SIZE} aria-hidden />
          </button>
        )}
      </div>

      <AccountBlockDots
        totalPages={totalPages}
        currentPage={currentPage}
        onGoToPage={(index) => carouselRef.current?.selectPage(index)}
      />
    </div>
  );
};

export default AccountBlockPager;
