import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔄 Testando conexão com Supabase...');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Chave:', supabaseKey ? 'Definida' : 'Não definida');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarConexao() {
  try {
    console.log('\n1. Testando conexão básica...');
    const { data, error } = await supabase.from('cobrancas').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão com Supabase estabelecida!');
    console.log('📊 Registros na tabela cobrancas:', data);

    console.log('\n2. Testando tabela resellers...');
    const { data: resellers, error: resellerError } = await supabase.from('resellers').select('count', { count: 'exact' });
    
    if (resellerError) {
      console.error('⚠️ Erro na tabela resellers:', resellerError.message);
    } else {
      console.log('📊 Registros na tabela resellers:', resellers);
    }

    console.log('\n3. Testando tabela users...');
    const { data: users, error: userError } = await supabase.from('users').select('count', { count: 'exact' });
    
    if (userError) {
      console.error('⚠️ Erro na tabela users:', userError.message);
    } else {
      console.log('📊 Registros na tabela users:', users);
    }

    console.log('\n4. Listando todas as tabelas disponíveis...');
    const { data: tables, error: tablesError } = await supabase.rpc('get_table_names');
    
    if (tablesError) {
      console.log('⚠️ Não foi possível listar tabelas (função RPC pode não existir)');
    } else {
      console.log('📋 Tabelas disponíveis:', tables);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarConexao();