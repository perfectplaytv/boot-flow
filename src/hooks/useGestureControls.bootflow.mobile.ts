import { useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

export interface GestureControlsOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  longPressDuration?: number;
}

export const useGestureControls = (options: GestureControlsOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onLongPress,
    swipeThreshold = 100,
    longPressDuration = 500,
  } = options;

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const bind = useGesture({
    onDragEnd: ({ direction, distance }) => {
      const [dx, dy] = direction;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (distance < swipeThreshold) return;

      if (absX > absY) {
        if (dx > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        if (dy > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    },
    onPointerDown: () => {
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          onLongPress();
        }, longPressDuration);
      }
    },
    onPointerUp: () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    },
  });

  return { bind };
};

