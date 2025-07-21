import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Paintbrush, UploadCloud, X, Check, GripVertical, Plus, Edit, Trash2, Palette, Code, Sliders, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const initialBrand = {
  name: 'Sua Empresa Ltda',
  slogan: 'Seu slogan aqui',
  description: '',
  website: 'https://suaempresa.com',
  email: 'contato@suaempresa.com',
  phone: '99999-9999',
  logo: '',
  favicon: ''
};

const initialDashboards = [
  {
    id: 1,
    name: 'Dashboard Principal',
    layout: 'Padrão',
    widgets: ['Métricas', 'Gráficos', 'Atividades Recentes', 'Notificações'],
    order: ['Métricas', 'Gráficos', 'Atividades Recentes', 'Notificações'],
    realtime: true,
    color: '#7c3aed',
  },
];

const AdminBranding: React.FC = () => {
  const [tab, setTab] = useState('marca');
  const [brand, setBrand] = useState(initialBrand);
  const [logoModal, setLogoModal] = useState(false);
  const [faviconModal, setFaviconModal] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [dashboardModal, setDashboardModal] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<any>(null);
  const [dashboardForm, setDashboardForm] = useState({
    name: '',
    layout: 'Padrão',
    widgets: ['Métricas'],
    order: ['Métricas'],
    realtime: true,
    color: '#7c3aed',
  });

  // Função para simular upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setBrand({ ...brand, logo: URL.createObjectURL(e.target.files[0]) });
      setLogoModal(false);
    }
  };
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaviconFile(e.target.files[0]);
      setBrand({ ...brand, favicon: URL.createObjectURL(e.target.files[0]) });
      setFaviconModal(false);
    }
  };

  // Funções para manipular dashboards
  const openNewDashboard = () => {
    setEditingDashboard(null);
    setDashboardForm({
      name: '',
      layout: 'Padrão',
      widgets: ['Métricas'],
      order: ['Métricas'],
      realtime: true,
      color: '#7c3aed',
    });
    setDashboardModal(true);
  };
  const openEditDashboard = (db: any) => {
    setEditingDashboard(db);
    setDashboardForm({
      name: db.name,
      layout: db.layout,
      widgets: db.widgets,
      order: db.order,
      realtime: db.realtime,
      color: db.color,
    });
    setDashboardModal(true);
  };
  const saveDashboard = () => {
    if (!dashboardForm.name.trim()) return;
    if (editingDashboard) {
      setDashboards(dashboards.map(db => db.id === editingDashboard.id ? { ...editingDashboard, ...dashboardForm } : db));
    } else {
      setDashboards([
        ...dashboards,
        { ...dashboardForm, id: Date.now() },
      ]);
    }
    setDashboardModal(false);
  };
  const removeDashboard = (id: number) => {
    setDashboards(dashboards.filter(db => db.id !== id));
  };
  // Drag & drop simples para ordem dos widgets
  const moveWidget = (from: number, to: number) => {
    const newOrder = [...dashboardForm.order];
    const [removed] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, removed);
    setDashboardForm({ ...dashboardForm, order: newOrder });
  };

  const renderContent = () => {
    switch (tab) {
      case 'marca':
        return <MarcaContent />;
      case 'visual':
        return <VisualContent />;
      case 'avancado':
        return <AvancadoContent />;
      case 'funcionalidades':
        return <FuncionalidadesContent />;
      case 'whitelabel':
        return <WhiteLabelContent />;
      default:
        return <MarcaContent />;
    }
  };

  const navItems = [
    { id: 'marca', title: 'Marca', icon: Paintbrush, description: 'Logo, nome e informações.' },
    { id: 'visual', title: 'Visual', icon: Palette, description: 'Cores, fontes e temas.' },
    { id: 'avancado', title: 'Avançado', icon: Code, description: 'Domínio, scripts e SEO.' },
    { id: 'funcionalidades', title: 'Funcionalidades', icon: Sliders, description: 'Módulos e integrações.' },
    { id: 'whitelabel', title: 'WhiteLabel', icon: Star, description: 'Sua marca própria.' },
  ];

  return (
    <div className="max-w-full w-full h-full overflow-auto p-4">
      <div className="flex items-center space-x-3 mb-2">
        <Paintbrush className="w-7 h-7 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Customizar Marca</h1>
      </div>
      <p className="text-gray-400 mb-6">Personalize a aparência e identidade da sua plataforma</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {navItems.map(item => (
          <Card 
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`cursor-pointer transition-all duration-300 ${tab === item.id ? 'border-purple-500 scale-105 shadow-purple-500/20' : 'border-gray-700 hover:border-purple-600'} bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-2`}
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
              <item.icon className={`w-8 h-8 ${tab === item.id ? 'text-purple-400' : 'text-gray-400'}`} />
              <div>
                <CardTitle className="text-md font-bold text-white">{item.title}</CardTitle>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div>{renderContent()}</div>

      {/* Modals permanecem aqui */}
      {/* Modal de upload de logo */}
      <Dialog open={logoModal} onOpenChange={setLogoModal}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Logo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <UploadCloud className="w-12 h-12 text-purple-400" />
            <input type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
            <label htmlFor="logo-upload" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer">Escolher arquivo</label>
            <span className="text-xs text-gray-400">PNG, JPG até 1MB</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoModal(false)} className="bg-gray-700 text-white">Cancelar</Button>
            <Button onClick={() => setLogoModal(false)} className="bg-purple-600 hover:bg-purple-700 text-white">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal de upload de favicon */}
      <Dialog open={faviconModal} onOpenChange={setFaviconModal}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Favicon</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <UploadCloud className="w-12 h-12 text-purple-400" />
            <input type="file" accept="image/png,image/x-icon" onChange={handleFaviconUpload} className="hidden" id="favicon-upload" />
            <label htmlFor="favicon-upload" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer">Escolher arquivo</label>
            <span className="text-xs text-gray-400">ICO, PNG até 1MB</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaviconModal(false)} className="bg-gray-700 text-white">Cancelar</Button>
            <Button onClick={() => setFaviconModal(false)} className="bg-purple-600 hover:bg-purple-700 text-white">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


// Separação dos conteúdos em componentes para melhor organização
const MarcaContent = () => {
  // O state e handlers de 'marca' precisariam ser passados via props ou context
  // Para este exemplo, estou movendo o JSX diretamente.
  const [brand, setBrand] = useState(initialBrand);
  const [logoModal, setLogoModal] = useState(false);
  const [faviconModal, setFaviconModal] = useState(false);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações da Empresa */}
              <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 shadow-lg">
                <span className="block text-purple-300 font-semibold mb-4 text-lg">Informações da Empresa</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Nome da Empresa *</label>
                    <Input value={brand.name} onChange={e => setBrand({ ...brand, name: e.target.value })} className="bg-gray-900 border border-gray-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Slogan</label>
                    <Input value={brand.slogan} onChange={e => setBrand({ ...brand, slogan: e.target.value })} className="bg-gray-900 border border-gray-700 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1 font-medium">Descrição</label>
                  <textarea value={brand.description} onChange={e => setBrand({ ...brand, description: e.target.value })} className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 min-h-[60px]" placeholder="Descreva sua empresa..."></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Website *</label>
                    <Input value={brand.website} onChange={e => setBrand({ ...brand, website: e.target.value })} className="bg-gray-900 border border-gray-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">E-mail *</label>
                    <Input value={brand.email} onChange={e => setBrand({ ...brand, email: e.target.value })} className="bg-gray-900 border border-gray-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Telefone *</label>
                    <Input value={brand.phone} onChange={e => setBrand({ ...brand, phone: e.target.value })} className="bg-gray-900 border border-gray-700 text-white" />
                  </div>
                </div>
              </div>
              {/* Logos e Ícones */}
              <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 shadow-lg">
                <span className="block text-purple-300 font-semibold mb-4 text-lg">Logos e Ícones</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo */}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/40 rounded-xl p-6 bg-[#181e29]">
                    {brand.logo ? (
                      <img src={brand.logo} alt="Logo" className="h-16 mb-2" />
                    ) : (
                      <UploadCloud className="w-10 h-10 text-purple-400 mb-2" />
                    )}
                    <p className="text-gray-400 text-xs mb-2">Clique para fazer upload<br />PNG, JPG até 1MB</p>
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => setLogoModal(true)}>Selecionar Logo</Button>
                  </div>
                  {/* Favicon */}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/40 rounded-xl p-6 bg-[#181e29]">
                    {brand.favicon ? (
                      <img src={brand.favicon} alt="Favicon" className="h-10 mb-2" />
                    ) : (
                      <UploadCloud className="w-10 h-10 text-purple-400 mb-2" />
                    )}
                    <p className="text-gray-400 text-xs mb-2">Clique para fazer upload<br />ICO, PNG até 1MB</p>
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => setFaviconModal(true)}>Selecionar Favicon</Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Coluna Preview */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 shadow-lg min-w-[260px]">
                <span className="block text-purple-300 font-semibold mb-4 text-lg">Preview</span>
                <div className="bg-[#181e29] rounded-lg p-4 flex flex-col items-center">
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <div className="w-4 h-4 rounded-full bg-gray-600" />
                    <div className="w-4 h-4 rounded-full bg-gray-700" />
                  </div>
                  <div className="w-full bg-white rounded p-2 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      {brand.logo ? (
                        <img src={brand.logo} alt="Logo" className="h-6" />
                      ) : (
                        <span className="font-bold text-gray-700">Sua Empresa</span>
                      )}
                    </div>
                    <div className="h-3 w-2/3 bg-purple-200 rounded mb-1" />
                    <div className="h-3 w-1/2 bg-purple-100 rounded" />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    <div>Template: Moderno</div>
                    <div>Fonte: Inter</div>
                    <div>Idioma: Português (Brasil)</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Cancelar</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold">Salvar Configurações</Button>
              </div>
            </div>
          </div>
  );
};

const VisualContent = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 shadow-lg">
        <span className="block text-purple-300 font-semibold mb-4 text-lg">Cores e Aparência</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Cor Primária</label>
            <input type="color" className="w-12 h-12 p-0 border-none bg-transparent" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Cor Secundária</label>
            <input type="color" className="w-12 h-12 p-0 border-none bg-transparent" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Fonte</label>
            <select className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2">
              <option>Inter</option>
              <option>Roboto</option>
              <option>Montserrat</option>
              <option>Poppins</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input type="checkbox" className="accent-purple-500" />
            <span className="text-gray-300">Modo escuro</span>
          </div>
        </div>
        <div className="mt-6">
          <span className="block text-gray-400 mb-2">Preview</span>
          <div className="rounded-lg bg-[#181e29] p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-600" />
            <div className="flex-1">
              <div className="h-3 w-2/3 bg-purple-400 rounded mb-1" />
              <div className="h-3 w-1/2 bg-purple-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AvancadoContent = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 shadow-lg">
        <span className="block text-purple-300 font-semibold mb-4 text-lg">Configurações Avançadas</span>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Domínio Personalizado</label>
          <Input placeholder="https://seudominio.com" className="bg-gray-900 border border-gray-700 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Google Analytics</label>
          <Input placeholder="UA-XXXXXX-X" className="bg-gray-900 border border-gray-700 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Scripts Customizados</label>
          <textarea className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 min-h-[60px]" placeholder="Cole aqui seu script..."></textarea>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <input type="checkbox" className="accent-purple-500" />
          <span className="text-gray-300">Ativar CDN de performance</span>
        </div>
      </div>
    </div>
  );
};

const FuncionalidadesContent = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 shadow-lg">
        <span className="block text-purple-300 font-semibold mb-4 text-lg">Módulos e Funcionalidades</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-purple-500" defaultChecked />
            <span className="text-gray-300">E-commerce</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-purple-500" defaultChecked />
            <span className="text-gray-300">Gamificação</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-purple-500" />
            <span className="text-gray-300">Notificações</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-purple-500" />
            <span className="text-gray-300">Exportação de Dados</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-purple-500" />
            <span className="text-gray-300">Relatórios Avançados</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="accent-purple-500" defaultChecked />
            <span className="text-gray-300">Chatbot IA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WhiteLabelContent = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-green-700/40 bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 shadow-lg">
        <span className="block text-green-300 font-semibold mb-4 text-lg">Configurações WhiteLabel</span>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Remover menção à plataforma original</label>
          <input type="checkbox" className="accent-green-500" />
          <span className="ml-2 text-gray-400 text-sm">Oculta qualquer referência à Symphonic Growth Hub</span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Domínio personalizado exclusivo</label>
          <Input placeholder="https://seudominioexclusivo.com" className="bg-gray-900 border border-gray-700 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">E-mail de suporte personalizado</label>
          <Input placeholder="suporte@seudominio.com" className="bg-gray-900 border border-gray-700 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Rodapé customizado</label>
          <textarea className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2 min-h-[60px]" placeholder="Texto do rodapé, links, copyright..."></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Cores e logotipo exclusivos</label>
          <div className="flex gap-4 items-center mt-2">
            <input type="color" className="w-10 h-10 p-0 border-none bg-transparent" />
            <Button className="bg-green-600 hover:bg-green-700 text-white">Upload Logo</Button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">Remover links de documentação padrão</label>
          <input type="checkbox" className="accent-green-500" />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold">Salvar WhiteLabel</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBranding; 