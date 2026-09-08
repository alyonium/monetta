import type { Icon } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import type { AccountIconName } from '@/modules/budget/components/accountIcons.ts';
import { ACCOUNT_ICON_SIZE } from '@/modules/budget/constants.ts';
import styles from './IconCell.module.css';

type IconCellProps = {
  name: AccountIconName;
  icon: Icon;
  selected: boolean;
  onPick: (name: AccountIconName) => void;
};

const IconCell = ({ name, icon: Glyph, selected, onPick }: IconCellProps) => (
  <button
    type='button'
    className={clsx(styles.cell, selected && styles.selected)}
    aria-label={name}
    aria-pressed={selected}
    onClick={() => onPick(name)}
  >
    <Glyph size={ACCOUNT_ICON_SIZE} aria-hidden />
  </button>
);

export default IconCell;
