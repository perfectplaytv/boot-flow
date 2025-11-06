import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Paintbrush, UploadCloud, X, Check, GripVertical, Plus, Edit, Trash2, Palette, Code, Sliders, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  const [originalBrand, setOriginalBrand] = useState(initialBrand);
  const [hasChanges, setHasChanges] = useState(false);
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

  // Carregar dados salvos do localStorage ao montar o componente
  useEffect(() => {
    const savedBrand = localStorage.getItem('brand-config');
    if (savedBrand) {
      try {
        const parsedBrand = JSON.parse(savedBrand);
        setBrand(parsedBrand);
        setOriginalBrand(parsedBrand);
      } catch (error) {
        console.error('Erro ao carregar configuração de marca:', error);
      }
    }
  }, []);

  // Verificar mudanças
  useEffect(() => {
    const changed = JSON.stringify(brand) !== JSON.stringify(originalBrand);
    setHasChanges(changed);
  }, [brand, originalBrand]);

  // Função para validar campos obrigatórios
  const validateBrand = () => {
    if (!brand.name.trim()) {
      toast.error('O nome da empresa é obrigatório');
      return false;
    }
    if (!brand.website.trim()) {
      toast.error('O website é obrigatório');
      return false;
    }
    if (!brand.email.trim()) {
      toast.error('O e-mail é obrigatório');
      return false;
    }
    if (!brand.phone.trim()) {
      toast.error('O telefone é obrigatório');
      return false;
    }
    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(brand.email)) {
      toast.error('E-mail inválido');
      return false;
    }
    // Validar formato de website
    const websiteRegex = /^https?:\/\/.+/;
    if (!websiteRegex.test(brand.website)) {
      toast.error('Website deve começar com http:// ou https://');
      return false;
    }
    return true;
  };

  // Função para salvar configuração
  const handleSave = () => {
    if (!validateBrand()) {
      return;
    }
    
    try {
      localStorage.setItem('brand-config', JSON.stringify(brand));
      setOriginalBrand(brand);
      setHasChanges(false);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  // Função para cancelar mudanças
  const handleCancel = () => {
    setBrand(originalBrand);
    setHasChanges(false);
    toast.info('Alterações descartadas');
  };

  // Função para upload de logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamanho (1MB máximo)
      if (file.size > 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 1MB');
        return;
      }
      
      // Validar tipo
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        toast.error('Apenas arquivos PNG ou JPG são permitidos');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrand({ ...brand, logo: reader.result as string });
        setLogoModal(false);
        toast.success('Logo carregado com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para upload de favicon
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamanho (1MB máximo)
      if (file.size > 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 1MB');
        return;
      }
      
      // Validar tipo
      if (!file.type.match(/image\/(png|x-icon|vnd.microsoft.icon)/)) {
        toast.error('Apenas arquivos PNG ou ICO são permitidos');
        return;
      }
      
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrand({ ...brand, favicon: reader.result as string });
        setFaviconModal(false);
        toast.success('Favicon carregado com sucesso!');
      };
      reader.readAsDataURL(file);
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

  const navItems = [
    { id: 'marca', title: 'Marca', icon: Paintbrush, description: 'Logo, nome e informações.', color: 'purple' },
    { id: 'visual', title: 'Visual', icon: Palette, description: 'Cores, fontes e temas.', color: 'green' },
    { id: 'avancado', title: 'Avançado', icon: Code, description: 'Domínio, scripts e SEO.', color: 'blue' },
    { id: 'funcionalidades', title: 'Funcionalidades', icon: Sliders, description: 'Módulos e integrações.', color: 'yellow' },
    { id: 'whitelabel', title: 'WhiteLabel', icon: Star, description: 'Sua marca própria.', color: 'red' },
  ];

  const colorClasses = {
    purple: {
      border: 'border-purple-500',
      shadow: 'shadow-purple-500/20',
      hoverBorder: 'hover:border-purple-600',
      from: 'from-purple-900/30',
      to: 'to-purple-800/20',
      icon: 'text-purple-400'
    },
    green: {
      border: 'border-green-500',
      shadow: 'shadow-green-500/20',
      hoverBorder: 'hover:border-green-600',
      from: 'from-green-900/30',
      to: 'to-green-800/20',
      icon: 'text-green-400'
    },
    blue: {
      border: 'border-blue-500',
      shadow: 'shadow-blue-500/20',
      hoverBorder: 'hover:border-blue-600',
      from: 'from-blue-900/30',
      to: 'to-blue-800/20',
      icon: 'text-blue-400'
    },
    yellow: {
      border: 'border-yellow-500',
      shadow: 'shadow-yellow-500/20',
      hoverBorder: 'hover:border-yellow-600',
      from: 'from-yellow-900/30',
      to: 'to-yellow-800/20',
      icon: 'text-yellow-400'
    },
    red: {
      border: 'border-red-500',
      shadow: 'shadow-red-500/20',
      hoverBorder: 'hover:border-red-600',
      from: 'from-red-900/30',
      to: 'to-red-800/20',
      icon: 'text-red-400'
    }
  };

  return (
    <div className="max-w-full w-full h-full overflow-auto p-4">
      <div className="flex items-center space-x-3 mb-2">
        <Paintbrush className="w-7 h-7 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Customizar Marca</h1>
      </div>
      <p className="text-gray-400 mb-6">Personalize a aparência e identidade da sua plataforma</p>
      
      {/* Navegação por Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {navItems.map(item => {
          const colors = colorClasses[item.color as keyof typeof colorClasses] || colorClasses.purple;
          return (
            <Card 
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`cursor-pointer transition-all duration-300 ${tab === item.id ? `${colors.border} scale-105 shadow-lg ${colors.shadow}` : `border-gray-700 ${colors.hoverBorder}`} bg-gradient-to-br ${colors.from} ${colors.to} border-2`}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                <item.icon className={`w-8 h-8 transition-colors ${tab === item.id ? colors.icon : 'text-gray-400'}`} />
                <div>
                  <CardTitle className="text-md font-bold text-white">{item.title}</CardTitle>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Conteúdo Renderizado */}
      <div>
        {tab === 'marca' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações da Empresa */}
              <Card className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-300 font-semibold text-lg">Informações da Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-gray-300 font-medium">
                        Nome da Empresa <span className="text-red-400">*</span>
                      </Label>
                      <Input 
                        id="company-name"
                        value={brand.name} 
                        onChange={e => setBrand({ ...brand, name: e.target.value })} 
                        className="bg-gray-900 border border-gray-700 text-white focus:border-purple-500" 
                        placeholder="Digite o nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slogan" className="text-gray-300 font-medium">
                        Slogan
                      </Label>
                      <Input 
                        id="slogan"
                        value={brand.slogan} 
                        onChange={e => setBrand({ ...brand, slogan: e.target.value })} 
                        className="bg-gray-900 border border-gray-700 text-white focus:border-purple-500" 
                        placeholder="Digite o slogan da empresa"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300 font-medium">
                      Descrição
                    </Label>
                    <textarea 
                      id="description"
                      value={brand.description} 
                      onChange={e => setBrand({ ...brand, description: e.target.value })} 
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-2 min-h-[80px] focus:border-purple-500 focus:outline-none resize-y" 
                      placeholder="Descreva sua empresa..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-gray-300 font-medium">
                        Website <span className="text-red-400">*</span>
                      </Label>
                      <Input 
                        id="website"
                        type="url"
                        value={brand.website} 
                        onChange={e => setBrand({ ...brand, website: e.target.value })} 
                        className="bg-gray-900 border border-gray-700 text-white focus:border-purple-500" 
                        placeholder="https://exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 font-medium">
                        E-mail <span className="text-red-400">*</span>
                      </Label>
                      <Input 
                        id="email"
                        type="email"
                        value={brand.email} 
                        onChange={e => setBrand({ ...brand, email: e.target.value })} 
                        className="bg-gray-900 border border-gray-700 text-white focus:border-purple-500" 
                        placeholder="contato@exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300 font-medium">
                        Telefone <span className="text-red-400">*</span>
                      </Label>
                      <Input 
                        id="phone"
                        value={brand.phone} 
                        onChange={e => setBrand({ ...brand, phone: e.target.value })} 
                        className="bg-gray-900 border border-gray-700 text-white focus:border-purple-500" 
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Logos e Ícones */}
              <Card className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-900/50 to-purple-800/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-300 font-semibold text-lg">Logos e Ícones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/40 rounded-xl p-6 bg-[#181e29] hover:border-purple-500 transition-colors">
                      {brand.logo ? (
                        <div className="mb-4">
                          <img src={brand.logo} alt="Logo" className="h-20 max-w-full object-contain mb-2 rounded" />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white border-0 mt-2"
                            onClick={() => {
                              setBrand({ ...brand, logo: '' });
                              setLogoFile(null);
                              toast.info('Logo removido');
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-12 h-12 text-purple-400 mb-3" />
                          <p className="text-gray-400 text-xs mb-4 text-center">
                            Clique para fazer upload<br />
                            PNG, JPG até 1MB
                          </p>
                        </>
                      )}
                      <Button 
                        className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white w-full" 
                        onClick={() => setLogoModal(true)}
                      >
                        {brand.logo ? 'Alterar Logo' : 'Selecionar Logo'}
                      </Button>
                    </div>
                    {/* Favicon */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/40 rounded-xl p-6 bg-[#181e29] hover:border-purple-500 transition-colors">
                      {brand.favicon ? (
                        <div className="mb-4">
                          <img src={brand.favicon} alt="Favicon" className="h-12 w-12 mb-2 rounded" />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white border-0 mt-2"
                            onClick={() => {
                              setBrand({ ...brand, favicon: '' });
                              setFaviconFile(null);
                              toast.info('Favicon removido');
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-12 h-12 text-purple-400 mb-3" />
                          <p className="text-gray-400 text-xs mb-4 text-center">
                            Clique para fazer upload<br />
                            ICO, PNG até 1MB
                          </p>
                        </>
                      )}
                      <Button 
                        className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white w-full" 
                        onClick={() => setFaviconModal(true)}
                      >
                        {brand.favicon ? 'Alterar Favicon' : 'Selecionar Favicon'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        )}
        {tab === 'visual' && (
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
        )}
        {tab === 'avancado' && (
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
        )}
        {tab === 'funcionalidades' && (
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
        )}
        {tab === 'whitelabel' && (
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
        )}
      </div>

      {/* Modals */}
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

export default AdminBranding; 