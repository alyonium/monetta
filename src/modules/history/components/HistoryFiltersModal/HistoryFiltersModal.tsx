import { Button, Group, Modal, Select } from '@mantine/core';
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TAGS_QUERY_KEY } from '@/helpers/tags/constants.ts';
import { fetchTags } from '@/helpers/tags/fetchTags.ts';
import { todayIso } from '@/modules/budget/helpers/month/budgetMonth.ts';
import {
  HISTORY_FILTER_SCOPE,
  HISTORY_FILTER_TYPE,
} from '@/modules/history/constants/filters.ts';
import { defaultHistoryFilters } from '@/modules/history/helpers/historyFilters.ts';
import { useHistoryFilterChanges } from '@/modules/history/hooks/useHistoryFilterChanges.ts';
import { HistoryFilters } from '@/modules/history/types/historyFilters.ts';
import styles from './HistoryFiltersModal.module.css';

type HistoryFiltersModalProps = {
  opened: boolean;
  onClose: () => void;
  filters: HistoryFilters;
  onChange: (filters: HistoryFilters) => void;
};

const HistoryFiltersModal = ({
  opened,
  onClose,
  filters,
  onChange,
}: HistoryFiltersModalProps) => {
  const { t } = useTranslation();

  const { data: tags = [] } = useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: fetchTags,
    enabled: opened,
  });

  const {
    onEndChange,
    onMonthChange,
    onScopeChange,
    onStartChange,
    onTypeChange,
  } = useHistoryFilterChanges(filters, onChange);

  const scopeOptions = [
    {
      value: HISTORY_FILTER_SCOPE.ALL,
      label: t('history.filters.allHistory'),
    },
    {
      value: HISTORY_FILTER_SCOPE.MONTH,
      label: t('history.filters.month'),
    },
    {
      value: HISTORY_FILTER_SCOPE.RANGE,
      label: t('history.filters.dateRange'),
    },
  ];

  const typeOptions = [
    {
      value: HISTORY_FILTER_TYPE.ALL,
      label: t('history.filters.allTypes'),
    },
    {
      value: HISTORY_FILTER_TYPE.DEPOSIT,
      label: t('history.type.deposit'),
    },
    {
      value: HISTORY_FILTER_TYPE.WITHDRAWAL,
      label: t('history.type.withdrawal'),
    },
    {
      value: HISTORY_FILTER_TYPE.TRANSFER,
      label: t('history.type.transfer'),
    },
    {
      value: HISTORY_FILTER_TYPE.RECONCILIATION,
      label: t('history.type.reconciliation'),
    },
    {
      value: HISTORY_FILTER_TYPE.OPENING_BALANCE,
      label: t('history.filters.openingBalance'),
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('history.filters.title')}
      centered
      closeButtonProps={{ 'aria-label': t('history.filters.close') }}
    >
      <div className={styles.body}>
        <Select
          label={t('history.filters.scope')}
          data={scopeOptions}
          allowDeselect={false}
          value={filters.scope}
          onChange={onScopeChange}
        />

        {filters.scope === HISTORY_FILTER_SCOPE.MONTH && (
          <MonthPickerInput
            allowDeselect={false}
            label={t('history.filters.month')}
            maxDate={todayIso()}
            onChange={onMonthChange}
            value={filters.month}
            valueFormat='MMM YYYY'
          />
        )}

        {filters.scope === HISTORY_FILTER_SCOPE.RANGE && (
          <>
            <DatePickerInput
              allowDeselect={false}
              label={t('history.filters.startDate')}
              onChange={onStartChange}
              value={filters.start}
              valueFormat='D MMM YYYY'
            />

            <DatePickerInput
              allowDeselect={false}
              label={t('history.filters.endDate')}
              onChange={onEndChange}
              value={filters.end}
              valueFormat='D MMM YYYY'
            />
          </>
        )}

        <Select
          label={t('history.filters.type')}
          data={typeOptions}
          allowDeselect={false}
          value={filters.type}
          onChange={onTypeChange}
        />

        <Select
          label={t('history.filters.tag')}
          placeholder={t('history.filters.allTags')}
          data={tags}
          clearable
          value={filters.tag}
          onChange={(value) => onChange({ ...filters, tag: value })}
        />

        <Group className={styles.actions} justify='flex-end'>
          <Button
            type='button'
            variant='default'
            onClick={() => onChange(defaultHistoryFilters(todayIso()))}
          >
            {t('history.filters.reset')}
          </Button>

          <Button type='button' onClick={onClose}>
            {t('history.filters.close')}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default HistoryFiltersModal;
