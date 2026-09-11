import { useRef } from 'react';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ICON_SIZE } from '@/modules/budget/constants/appearance.ts';
import { useAccountBlockPager } from '@/modules/budget/hooks/useAccountBlockPager.ts';
import type { AccountBlockPagerLayout } from '@/modules/budget/types/accountBlockPagerLayout.ts';
import type { AccountBlockViewportHandle } from '@/modules/budget/types/accountBlockViewportHandle.ts';
import type { BudgetAccount } from '@/modules/budget/types/budgetAccount.ts';
import AccountBlockDots from './AccountBlockDots/AccountBlockDots.tsx';
import AccountBlockViewport from './AccountBlockViewport/AccountBlockViewport.tsx';
import styles from './AccountBlockPager.module.css';

type AccountBlockPagerProps = {
  accounts: BudgetAccount[];
  onAddAccount: () => void;
  onSelectAccount: (account: BudgetAccount) => void;
} & AccountBlockPagerLayout;

const AccountBlockPager = ({
  accounts,
  onAddAccount,
  onSelectAccount,
  minHeight,
  fillHeight,
  minCardHeightPx,
}: AccountBlockPagerProps) => {
  const { t } = useTranslation();
  const carouselRef = useRef<AccountBlockViewportHandle>(null);
  const {
    viewportRef,
    items,
    columns,
    pageSize,
    currentPage,
    totalPages,
    showArrows,
    goNext,
    goPrev,
    goToPage,
  } = useAccountBlockPager({ accounts, fillHeight, minCardHeightPx });

  return (
    <div className={styles.pager}>
      <div className={clsx(styles.row, fillHeight && styles.rowFill)}>
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
          pageSize={pageSize}
          totalPages={totalPages}
          minHeight={minHeight}
          fillHeight={fillHeight}
          pageIndex={currentPage}
          onNext={goNext}
          onPrev={goPrev}
          onJump={goToPage}
          onAddAccount={onAddAccount}
          onSelectAccount={onSelectAccount}
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
