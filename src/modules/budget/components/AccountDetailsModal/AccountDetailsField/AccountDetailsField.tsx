import { Text } from '@mantine/core';
import styles from './AccountDetailsField.module.css';

type AccountDetailsFieldProps = {
  label: string;
  value: string;
  className?: string;
};

const AccountDetailsField = ({
  label,
  value,
  className,
}: AccountDetailsFieldProps) => (
  <div className={className}>
    <Text size='sm' className={styles.label}>
      {label}
    </Text>

    <Text className={styles.value}>{value}</Text>
  </div>
);

export default AccountDetailsField;
