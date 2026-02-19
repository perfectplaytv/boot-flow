import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, FileText, Users, DollarSign, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts.agent';

export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  category: string;
}

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useKeyboardShortcuts([
    {
      keys: ['Control', 'k'],
      handler: () => setOpen(true),
      preventDefault: true,
    },
    {
      keys: ['Meta', 'k'],
      handler: () => setOpen(true),
      preventDefault: true,
    },
  ]);

  const searchItems: SearchItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Admin',
      description: 'Visão geral do sistema',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => {
        navigate('/admin');
        setOpen(false);
      },
      category: 'Navegação',
    },
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      description: 'Visualizar e editar clientes',
      icon: <Users className="h-4 w-4" />,
      action: () => {
        navigate('/admin');
        setOpen(false);
      },
      category: 'Gerenciamento',
    },
    {
      id: 'analytics',
      title: 'Analytics Plus',
      description: 'Análises avançadas',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => {
        navigate('/admin');
        setOpen(false);
      },
      category: 'Analytics',
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Ajustar preferências',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        navigate('/configuracoes');
        setOpen(false);
      },
      category: 'Sistema',
    },
  ];

  const filteredItems = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 bg-slate-950 border-slate-800">
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b border-slate-800 px-4 py-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar comandos, páginas, ações..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-slate-400">
              Nenhum resultado encontrado.
            </Command.Empty>
            {Object.entries(grouped).map(([category, items]) => (
              <Command.Group key={category} heading={category} className="px-2 py-1.5 text-xs font-semibold text-slate-400">
                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={item.action}
                    className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-200 outline-none aria-selected:bg-slate-800 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    {item.icon}
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-slate-400">{item.description}</span>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

