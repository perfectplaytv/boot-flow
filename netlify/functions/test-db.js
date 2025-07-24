const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
  // Configurar CORS para permitir requisições do frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  try {
    const sql = neon();
    
    // Criar tabela de teste se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS test_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Inserir dados de teste
    const insertResult = await sql`
      INSERT INTO test_users (name, email) 
      VALUES ('João Silva', 'joao@teste.com')
      ON CONFLICT (email) DO NOTHING
      RETURNING *
    `;

    // Buscar todos os usuários
    const users = await sql`SELECT * FROM test_users ORDER BY created_at DESC`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Conexão com banco Neon funcionando!',
        inserted: insertResult,
        users: users,
        totalUsers: users.length
      })
    };

  } catch (error) {
    console.error('Erro na função:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Erro ao conectar com o banco',
        error: error.message
      })
    };
  }
}; 