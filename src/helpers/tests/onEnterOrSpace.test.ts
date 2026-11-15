import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { onEnterOrSpace } from '@/helpers/onEnterOrSpace.ts';

const keyEvent = (key: string) => {
  const preventDefault = vi.fn();
  const event = { key, preventDefault } as unknown as KeyboardEvent;

  return { event, preventDefault };
};

describe('onEnterOrSpace', () => {
  it.each(['Enter', ' '])('calls back and prevents default on %j', (key) => {
    const callback = vi.fn();
    const { event, preventDefault } = keyEvent(key);

    onEnterOrSpace(callback)(event);

    expect(callback).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('ignores other keys', () => {
    const callback = vi.fn();
    const { event, preventDefault } = keyEvent('a');

    onEnterOrSpace(callback)(event);

    expect(callback).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
