import type { Icon } from '@phosphor-icons/react';
import { NAV_LABEL_KEY } from '@/components/AppLayout/constants.ts';

export type NavLabelKey =
  (typeof NAV_LABEL_KEY)[keyof typeof NAV_LABEL_KEY];

export type FooterTab = {
  to: string;
  icon: Icon;
  labelKey: NavLabelKey;
};
