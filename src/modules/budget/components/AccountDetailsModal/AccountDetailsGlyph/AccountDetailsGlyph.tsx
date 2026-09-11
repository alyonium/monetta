import type { Icon } from '@phosphor-icons/react';
import { ACCOUNT_ICON_SIZE } from '@/modules/budget/constants/appearance.ts';
import styles from './AccountDetailsGlyph.module.css';

type AccountDetailsGlyphProps = {
  icon: Icon;
};

const AccountDetailsGlyph = ({ icon: Icon }: AccountDetailsGlyphProps) => (
  <Icon aria-hidden className={styles.glyph} size={ACCOUNT_ICON_SIZE} />
);

export default AccountDetailsGlyph;
