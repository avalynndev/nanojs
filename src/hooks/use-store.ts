import React from "react";

type Listener<T> = (state: T) => void;

export function createStore<T extends Record<string, any>>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener<T>>();

  function set(partial: Partial<T>) {
    state = { ...state, ...partial };
    listeners.forEach((l) => l(state));
  }

  function get() {
    return state;
  }

  function useStore(): [T, typeof set] {
    const [local, setLocal] = React.useState(state);

    React.useEffect(() => {
      const l: Listener<T> = (s) => setLocal(s);
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    }, []);

    return [local, set];
  }

  return { useStore, get, set };
}
