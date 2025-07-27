import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';

// Adapte as props conforme necessário
interface AddClienteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  addCliente: (userData: any) => Promise<void>;
  extractM3UData: (url: string) => Promise<any>;
}

export default function AddClienteForm({ onSuccess, onCancel, addCliente, extractM3UData }: AddClienteFormProps) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    plan: '',
    status: 'Ativo',
    telegram: '',
    observations: '',
    expirationDate: '',
    password: '',
    bouquets: '',
    realName: '',
    whatsapp: '',
    devices: 0,
    credits: 0,
    notes: '',
  });
  const [m3uUrl, setM3uUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [extractionError, setExtractionError] = useState('');

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const userData = {
          name: newUser.realName || newUser.name,
          email: newUser.email,
          password: newUser.password || '',
          m3u_url: newUser.plan || '',
          bouquets: newUser.bouquets || '',
          expiration_date: newUser.expirationDate || null,
          observations: newUser.observations || '',
        };
        await addCliente(userData);
        if (onSuccess) onSuccess();
      } catch (error) {
        // Trate o erro conforme necessário
      }
    }
  };

  const handleExtractM3U = async () => {
    setIsExtracting(true);
    setExtractionError('');
    try {
      const result = await extractM3UData(m3uUrl);
      setExtractionResult(result);
    } catch (err: any) {
      setExtractionError(err.message || 'Erro ao extrair M3U');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="relative">
      <div className="px-6 pt-6 pb-2 border-b border-gray-800 bg-[#18181b]">
        <h2 className="text-lg font-semibold leading-none tracking-tight text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-green-500" />
          Adicionar Cliente
          <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Novo</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Preencha os dados do novo cliente para adicioná-lo à base de dados.</p>
      </div>
      <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto scrollbar-hide bg-[#18181b]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-green-400 text-xs font-medium">• Campos obrigatórios marcados com *</span>
          <span className="text-blue-400 text-xs font-medium">• Dados serão sincronizados automaticamente</span>
        </div>
        {/* Extração M3U */}
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-300 font-medium">Extração M3U</span>
            <div className="flex gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm" onClick={handleExtractM3U} disabled={isExtracting}>Extrair</Button>
            </div>
          </div>
          <p className="text-xs text-blue-300 mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
          <Input placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..." className="bg-[#1f2937] border border-blue-800 text-white mb-2" value={m3uUrl} onChange={e => setM3uUrl(e.target.value)} />
          {extractionError && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 text-xs rounded p-2 mb-2">❌ {extractionError}</div>
          )}
          {extractionResult && !extractionError && (
            <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2 mb-2">✅ {extractionResult.message}</div>
          )}
        </div>
        {/* ...restante do formulário igual ao modal original... */}
        {/* Adapte todos os campos do formulário conforme extraído do AdminUsers */}
        {/* ... */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel} className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Fechar</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold transition-all duration-300" onClick={handleAddUser}>Adicionar Cliente</Button>
        </div>
      </div>
    </div>
  );
} 