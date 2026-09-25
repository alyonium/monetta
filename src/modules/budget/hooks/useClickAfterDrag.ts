import { useLayoutEffect, useRef } from 'react';

export const useClickAfterDrag = (
  isDragging: boolean,
  onClick: () => void,
) => {
  const skipClick = useRef(false);

  useLayoutEffect(() => {
    if (isDragging) {
      skipClick.current = true;
    }
  }, [isDragging]);

  const handleClick = () => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }

    onClick();
  };

  const resetSkip = () => {
    skipClick.current = false;
  };

  return { onClick: handleClick, onPointerDownCapture: resetSkip };
};
