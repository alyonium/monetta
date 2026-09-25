import { useState } from 'react';

type ModalSession<P> = {
  opened: boolean;
  payload: P | null;
  id: number;
};

export const useModalSession = <P>() => {
  const [session, setSession] = useState<ModalSession<P>>({
    opened: false,
    payload: null,
    id: 0,
  });

  const open = (payload: P) =>
    setSession((current) => ({
      opened: true,
      payload,
      id: current.id + 1,
    }));

  const close = () =>
    setSession((current) => ({ ...current, opened: false }));

  const dispose = () =>
    setSession((current) =>
      current.opened
        ? current
        : { opened: false, payload: null, id: current.id },
    );

  return { session, open, close, dispose };
};
