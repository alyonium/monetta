import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  formatAnalyticsPeriod,
  periodMonthLabels,
  diagramMonthDots,
  stepDiagramMonth,
} from '@/modules/analytics/helpers/analyticsPeriod.ts';
import { useDiagramMonthSwipe } from '@/modules/analytics/hooks/useDiagramMonthSwipe.ts';
import { AnalyticsRange } from '@/modules/analytics/types/analytics.ts';
import styles from './DiagramMonthPager.module.css';

type DiagramMonthPagerProps = {
  children: ReactNode;
  onRangeChange: (range: AnalyticsRange) => void;
  range: AnalyticsRange;
  today: string;
};

const DiagramMonthPager = ({
  children,
  onRangeChange,
  range,
  today,
}: DiagramMonthPagerProps) => {
  const { t } = useTranslation();
  const monthLabels = periodMonthLabels(t);
  const dots = diagramMonthDots(range, today);
  const {
    onClickCapture,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useDiagramMonthSwipe({
    enabled: dots !== null,
    onSwipe: (direction) => {
      const next = stepDiagramMonth(range, direction, today);

      if (!next) {
        return;
      }

      onRangeChange(next);
    },
  });

  return (
    <div
      className={styles.pager}
      onClickCapture={onClickCapture}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
      {dots && (
        <div className={styles.dots}>
          {dots.map((dotRange) => {
            const current = dotRange.from === range.from;

            return (
              <button
                aria-current={current || undefined}
                aria-label={formatAnalyticsPeriod(dotRange, monthLabels)}
                className={clsx(styles.dot, current && styles.dotCurrent)}
                key={dotRange.from}
                type='button'
                onClick={() => {
                  if (current) {
                    return;
                  }

                  onRangeChange(dotRange);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiagramMonthPager;
