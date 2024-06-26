import { createContext, useContext } from 'react';
import type { ReactOn, ReactOnBase, TrackingContext, TrackingHandlerContext, TrackingValues } from '../types';
import { createTrackingHandlerProvider } from './handlers';
import { createTrackingProvider } from './provider';
import { createTrackCallback } from './track-callback';
import { createTrackEvent } from './track-event';

export function createTrackingContext<TBase extends ReactOnBase = ReactOn>() {
  type TContext = TrackingContext<TBase>;
  type THandlerContext = TrackingHandlerContext<TBase>;
  type TValues = TrackingValues<TBase>;

  const ctx = createContext<TContext>({ enabled: true, values: {} as TValues });
  const useTrackingContext = () => useContext(ctx);

  const handlerCtx = createContext<THandlerContext>({ handle: () => {} });
  const useTrackingHandler = () => useContext(handlerCtx);

  const { useTrack, TrackingHandler, ConsoleTrackingHandler } = createTrackingHandlerProvider<TBase>(ctx, handlerCtx);
  const { Tracking } = createTrackingProvider<TBase>(ctx, useTrack);
  const { TrackCallback } = createTrackCallback<TBase>(useTrack);
  const { TrackEvent } = createTrackEvent<TBase>(useTrack);

  return {
    Tracking,
    useTrackingContext,
    useTrackingHandler,
    useTrack,
    TrackingHandler,
    ConsoleTrackingHandler,
    TrackCallback,
    TrackEvent,
  } as const;
}
