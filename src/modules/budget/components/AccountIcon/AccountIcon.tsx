import { type CSSProperties } from 'react';
import type { Icon } from '@phosphor-icons/react';
import { accountIconGlyphColor } from '@/modules/budget/helpers/accountIconContrast.ts';
import { ACCOUNT_ICON_SIZE } from '@/modules/budget/constants.ts';
import styles from './AccountIcon.module.css';

type AccountIconProps = {
  icon: Icon;
  color: string;
};

const AccountIcon = ({ icon: Icon, color }: AccountIconProps) => (
  <span
    className={styles.badge}
    style={
      {
        '--account-icon-color': color,
        '--account-icon-glyph-color': accountIconGlyphColor(color),
      } as CSSProperties
    }
  >
    <Icon size={ACCOUNT_ICON_SIZE} aria-hidden />
  </span>
);

export default AccountIcon;
