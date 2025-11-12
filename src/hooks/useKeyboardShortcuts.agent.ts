import { useEffect } from 'react';

export interface KeyboardShortcutConfig {
  keys: string[];
  handler: (event: KeyboardEvent) => void | boolean | Promise<void | boolean>;
  preventDefault?: boolean;
  enabled?: boolean;
}

const normalizeKey = (key: string) => key.toLowerCase();

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcutConfig[]) => {
  useEffect(() => {
    const filtered = shortcuts.filter((shortcut) => shortcut.enabled ?? true);
    if (filtered.length === 0) return;

    const listener = async (event: KeyboardEvent) => {
      const pressed = new Set<string>();
      if (event.metaKey) pressed.add('meta');
      if (event.ctrlKey) pressed.add('control');
      if (event.shiftKey) pressed.add('shift');
      if (event.altKey) pressed.add('alt');
      pressed.add(normalizeKey(event.key));

      for (const shortcut of filtered) {
        const expected = shortcut.keys.map(normalizeKey);
        if (expected.every((key) => pressed.has(key))) {
          if (shortcut.preventDefault) {
            event.preventDefault();
          }
          await shortcut.handler(event);
        }
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [shortcuts]);
};
