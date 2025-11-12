import { useEffect, useMemo, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts.agent';

export interface CommandPaletteItem {
  id: string;
  title: string;
  description?: string;
  group?: string;
  shortcut?: string;
  onSelect: () => void | Promise<void>;
}

export interface CommandPaletteProps {
  items: CommandPaletteItem[];
  placeholder?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandPalette = ({
  items,
  placeholder = 'Buscar comandos…',
  open: controlledOpen,
  onOpenChange,
}: CommandPaletteProps) => {
  const [search, setSearch] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const toggle = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  useKeyboardShortcuts([
    {
      keys: ['Control', 'k'],
      handler: () => toggle(!open),
      preventDefault: true,
    },
    {
      keys: ['Meta', 'k'],
      handler: () => toggle(!open),
      preventDefault: true,
    },
  ]);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const grouped = useMemo(() => {
    const groups = new Map<string, CommandPaletteItem[]>();
    items.forEach((item) => {
      const groupName = item.group ?? 'Geral';
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(item);
    });
    return groups;
  }, [items]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={toggle}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border border-slate-700/60 bg-slate-900/40 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-slate-300">Buscar em toda a dashboard…</span>
          <kbd className="rounded bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-400">Ctrl/⌘ + K</kbd>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-x-0 top-24 z-[130] mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
          <Command value={search} onValueChange={setSearch} className="CommandPalette">
            <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <Command.Input
                autoFocus
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
            <Command.List className="max-h-72 overflow-y-auto px-2 py-3">
              <Command.Empty className="px-4 py-6 text-center text-sm text-slate-500">
                Nenhum resultado encontrado.
              </Command.Empty>
              {[...grouped.entries()].map(([groupName, groupItems]) => (
                <Command.Group key={groupName} heading={groupName} className="mb-2">
                  {groupItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      onSelect={() => {
                        void item.onSelect();
                        toggle(false);
                      }}
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-slate-200 data-[selected=true]:bg-slate-800"
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        {item.description && (
                          <p className="text-xs text-slate-400">{item.description}</p>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
                          {item.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
