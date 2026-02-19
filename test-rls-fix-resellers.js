// Script de teste para verificar se a correção do RLS funcionou para revendedores
// Execute este script no console do navegador após aplicar as correções

async function testRLSFixResellers() {
  console.log('🧪 Testando correção do RLS para revendedores...');
  
  try {
    // Importar o cliente Supabase
    const { supabase } = await import('./src/lib/supabaseClient.ts');
    
    console.log('📡 Testando conexão com Supabase...');
    
    // Teste 1: Verificar se consegue fazer SELECT
    console.log('1️⃣ Testando SELECT...');
    const { data: selectData, error: selectError } = await supabase
      .from('resellers')
      .select('count');
    
    if (selectError) {
      console.error('❌ Erro no SELECT:', selectError);
      return false;
    } else {
      console.log('✅ SELECT funcionando:', selectData);
    }
    
    // Teste 2: Verificar se consegue fazer INSERT
    console.log('2️⃣ Testando INSERT...');
    const testReseller = {
      username: 'test-reseller-rls',
      password: 'test123',
      permission: 'reseller',
      credits: 10,
      personal_name: 'Teste RLS Fix',
      email: `test-reseller-${Date.now()}@example.com`,
      created_at: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('resellers')
      .insert([testReseller])
      .select();
    
    if (insertError) {
      console.error('❌ Erro no INSERT:', insertError);
      return false;
    } else {
      console.log('✅ INSERT funcionando:', insertData);
      
      // Teste 3: Verificar se consegue fazer UPDATE
      console.log('3️⃣ Testando UPDATE...');
      const resellerId = insertData[0].id;
      const { data: updateData, error: updateError } = await supabase
        .from('resellers')
        .update({ personal_name: 'Teste RLS Fix - Atualizado' })
        .eq('id', resellerId)
        .select();
      
      if (updateError) {
        console.error('❌ Erro no UPDATE:', updateError);
        return false;
      } else {
        console.log('✅ UPDATE funcionando:', updateData);
        
        // Teste 4: Verificar se consegue fazer DELETE
        console.log('4️⃣ Testando DELETE...');
        const { error: deleteError } = await supabase
          .from('resellers')
          .delete()
          .eq('id', resellerId);
        
        if (deleteError) {
          console.error('❌ Erro no DELETE:', deleteError);
          return false;
        } else {
          console.log('✅ DELETE funcionando');
        }
      }
    }
    
    console.log('🎉 Todos os testes passaram! O RLS para revendedores foi corrigido com sucesso.');
    return true;
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    return false;
  }
}

// Função para testar especificamente o erro RLS
async function testRLSErrorResellers() {
  console.log('🔍 Verificando se ainda há erros de RLS para revendedores...');
  
  try {
    const { supabase } = await import('./src/lib/supabaseClient.ts');
    
    const { data, error } = await supabase
      .from('resellers')
      .insert([{
        username: 'test-rls-error-reseller',
        password: 'test123',
        permission: 'reseller',
        credits: 10,
        personal_name: 'Teste RLS Error',
        email: `test-error-reseller-${Date.now()}@example.com`
      }])
      .select();
    
    if (error && error.message.includes('row-level security policy')) {
      console.error('❌ Ainda há erro de RLS para revendedores:', error.message);
      console.log('💡 Execute o script SQL para corrigir as políticas RLS da tabela resellers');
      return false;
    } else if (error) {
      console.error('❌ Outro erro:', error.message);
      return false;
    } else {
      console.log('✅ Nenhum erro de RLS detectado para revendedores');
      
      // Limpar o teste
      await supabase
        .from('resellers')
        .delete()
        .eq('email', data[0].email);
      
      return true;
    }
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    return false;
  }
}

// Executar os testes
console.log('🚀 Iniciando testes de correção do RLS para revendedores...');
console.log('');

// Teste principal
testRLSFixResellers().then(success => {
  console.log('');
  if (success) {
    console.log('✅ Correção do RLS para revendedores foi bem-sucedida!');
  } else {
    console.log('❌ Ainda há problemas com o RLS para revendedores');
  }
});

// Teste específico de erro RLS
setTimeout(() => {
  testRLSErrorResellers();
}, 2000); 