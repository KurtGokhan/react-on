import { addMiddlewares } from 'jsx-middlewares/react';
import { TrackCallback, TrackEvent, TrackingProvider } from '..';
import type { TrackingData } from '../types';

export interface TrackingAttributes {
  $tracking?: TrackingData;
  $trackCallback?: string;
  $trackEvent?: string;
}

declare module 'react' {
  interface Attributes extends TrackingAttributes {}
}

function register() {
  addMiddlewares(
    function trackEventDirective(next, type, { $trackEvent, ...props }, key) {
      if ($trackEvent) {
        return (
          <TrackEvent event={$trackEvent} key={key}>
            {next(type, props, undefined)}
          </TrackEvent>
        );
      }

      return next(type, props, key);
    },
    function trackCallbackDirective(next, type, { $trackCallback, ...props }, key) {
      if ($trackCallback) {
        return (
          <TrackCallback callback={$trackCallback} key={key}>
            {next(type, props, undefined)}
          </TrackCallback>
        );
      }

      return next(type, props, key);
    },
    function trackingDirective(next, type, { $tracking, ...props }, key) {
      if ($tracking) {
        return (
          <TrackingProvider data={$tracking} key={key}>
            {next(type, props, undefined)}
          </TrackingProvider>
        );
      }

      return next(type, props, key);
    },
  );
}

register();
