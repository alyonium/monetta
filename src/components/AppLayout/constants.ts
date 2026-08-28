import {
  ChartPieSliceIcon,
  ClockCounterClockwiseIcon,
  GearIcon,
  WalletIcon,
} from '@phosphor-icons/react';
import type { FooterTab } from '@/components/AppLayout/types/footerTab.ts';
import { ROUTE } from '@/constants/router.ts';

export const NAV_LABEL_KEY = {
  BUDGET: 'nav.budget',
  HISTORY: 'nav.history',
  ANALYTICS: 'nav.analytics',
  SETTINGS: 'nav.settings',
} as const;

export const FOOTER_TABS = [
  { to: ROUTE.BUDGET, icon: WalletIcon, labelKey: NAV_LABEL_KEY.BUDGET },
  {
    to: ROUTE.HISTORY,
    icon: ClockCounterClockwiseIcon,
    labelKey: NAV_LABEL_KEY.HISTORY,
  },
  {
    to: ROUTE.ANALYTICS,
    icon: ChartPieSliceIcon,
    labelKey: NAV_LABEL_KEY.ANALYTICS,
  },
  { to: ROUTE.SETTINGS, icon: GearIcon, labelKey: NAV_LABEL_KEY.SETTINGS },
] satisfies FooterTab[];
