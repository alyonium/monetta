import { KeyboardEvent } from 'react';

export const onEnterOrSpace =
  (callback: () => void) =>
  (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    callback();
  };
