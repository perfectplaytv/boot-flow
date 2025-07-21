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
        const { data: users, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).set(headers).json({ success: true, users, total: users.length });
        break;
      }
      case 'POST': {
        const newUser = typeof req.body === 'string' && req.body !== '' ? JSON.parse(req.body) : req.body;
        const { data, error } = await supabase.from('users').insert([newUser]).select();
        if (error) throw error;
        res.status(201).set(headers).json({ success: true, message: 'Usuário criado com sucesso!', user: data[0] });
        break;
      }
      case 'PUT': {
        const body = typeof req.body === 'string' && req.body !== '' ? JSON.parse(req.body) : req.body;
        const { id, ...updateData } = body;
        const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select();
        if (error) throw error;
        if (!data.length) {
          res.status(404).set(headers).json({ success: false, message: 'Usuário não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Usuário atualizado com sucesso!', user: data[0] });
        }
        break;
      }
      case 'DELETE': {
        const body = typeof req.body === 'string' && req.body !== '' ? JSON.parse(req.body) : req.body;
        const { id } = body;
        const { data, error } = await supabase.from('users').delete().eq('id', id).select();
        if (error) throw error;
        if (!data.length) {
          res.status(404).set(headers).json({ success: false, message: 'Usuário não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Usuário deletado com sucesso!', user: data[0] });
        }
        break;
      }
      default:
        res.status(405).set(headers).json({ success: false, message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na rota /api/users:', error);
    res.status(500).set(headers).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
} 