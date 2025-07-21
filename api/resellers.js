import { supabase } from '../src/lib/supabaseClient';

export default async function handler(req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  if (req.method === 'OPTIONS') {
    res.status(200).set(headers).send('');
    return;
  }

  try {
    switch (req.method) {
      case 'GET': {
        const { data: resellers, error } = await supabase.from('resellers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).set(headers).json({ success: true, resellers, total: resellers.length });
        break;
      }
      case 'POST': {
        const newReseller = typeof req.body === 'string' && req.body !== '' ? JSON.parse(req.body) : req.body;
        const { data, error } = await supabase.from('resellers').insert([newReseller]).select();
        if (error) throw error;
        res.status(201).set(headers).json({ success: true, message: 'Revendedor criado com sucesso!', reseller: data[0] });
        break;
      }
      case 'PUT': {
        const body = typeof req.body === 'string' && req.body !== '' ? JSON.parse(req.body) : req.body;
        const { id, ...updateData } = body;
        const { data, error } = await supabase.from('resellers').update(updateData).eq('id', id).select();
        if (error) throw error;
        if (!data.length) {
          res.status(404).set(headers).json({ success: false, message: 'Revendedor não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Revendedor atualizado com sucesso!', reseller: data[0] });
        }
        break;
      }
      case 'DELETE': {
        const body = typeof req.body === 'string' && req.body !== '' ? JSON.parse(req.body) : req.body;
        const { id } = body;
        const { data, error } = await supabase.from('resellers').delete().eq('id', id).select();
        if (error) throw error;
        if (!data.length) {
          res.status(404).set(headers).json({ success: false, message: 'Revendedor não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Revendedor deletado com sucesso!', reseller: data[0] });
        }
        break;
      }
      default:
        res.status(405).set(headers).json({ success: false, message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na rota /api/resellers:', error);
    res.status(500).set(headers).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
} 