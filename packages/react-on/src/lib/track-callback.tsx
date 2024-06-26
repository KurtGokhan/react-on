import type { DOMAttributes, ReactElement } from 'react';
import { Children, cloneElement, useCallback } from 'react';
import { useStableCallback } from '../hooks/use-stable-callback';
import type { ReactOn, ReactOnBase, TrackCallbackProps, TrackFn } from '../types';

type CallbackNames<Props> = keyof { [key in keyof Props as key extends `on${string}` ? key : never]: true };

export function createTrackCallback<TBase extends ReactOnBase = ReactOn>(useTrack: () => TrackFn<TBase>) {
  type TProps = TrackCallbackProps<TBase>;

  function TrackCallback<
    ComponentType = DOMAttributes<any>,
    CallbackName extends PropertyKey = CallbackNames<ComponentType> | (string & {}),
  >({ children, callback, name, disabled, values, ...props }: TProps & { callback: CallbackName }) {
    children = Children.only(children) as ReactElement;

    if (!children) throw new Error('Children passed to track directive must be an element with ref');
    if (!callback) throw new Error('Callback name must be provided');

    const resolvedName = name ?? String(callback);
    const track = useTrack();
    const trackFn = useStableCallback((...args: any[]) => track({ values, args: [resolvedName, ...args] }));

    const originalCallback = children.props[callback];
    const handle = useCallback(
      (...args: any[]) => {
        trackFn(...args);
        return originalCallback?.(args);
      },
      [originalCallback, trackFn],
    );

    return cloneElement(children, {
      ...children.props,
      [callback]: handle,
    });
  }

  return { TrackCallback };
}
