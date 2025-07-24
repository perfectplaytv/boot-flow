const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  // Configurar CORS para requisições OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const sql = neon();
    
    // Criar tabela de usuários se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        m3u_url TEXT,
        bouquets TEXT,
        expiration_date DATE,
        observations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { httpMethod, body } = event;

    switch (httpMethod) {
      case 'GET':
        // Buscar todos os usuários
        const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            users,
            total: users.length
          })
        };

      case 'POST':
        // Criar novo usuário
        const newUser = JSON.parse(body);
        const insertResult = await sql`
          INSERT INTO users (name, email, password, m3u_url, bouquets, expiration_date, observations)
          VALUES (${newUser.name}, ${newUser.email}, ${newUser.password || null}, 
                  ${newUser.m3u_url || null}, ${newUser.bouquets || null}, 
                  ${newUser.expiration_date || null}, ${newUser.observations || null})
          RETURNING *
        `;
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Usuário criado com sucesso!',
            user: insertResult[0]
          })
        };

      case 'PUT':
        // Atualizar usuário
        const { id, ...updateData } = JSON.parse(body);
        const updateResult = await sql`
          UPDATE users 
          SET name = ${updateData.name}, 
              email = ${updateData.email}, 
              password = ${updateData.password || null},
              m3u_url = ${updateData.m3u_url || null},
              bouquets = ${updateData.bouquets || null},
              expiration_date = ${updateData.expiration_date || null},
              observations = ${updateData.observations || null},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Usuário não encontrado'
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Usuário atualizado com sucesso!',
            user: updateResult[0]
          })
        };

      case 'DELETE':
        // Deletar usuário
        const { id: deleteId } = JSON.parse(body);
        const deleteResult = await sql`
          DELETE FROM users WHERE id = ${deleteId} RETURNING *
        `;
        
        if (deleteResult.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Usuário não encontrado'
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Usuário deletado com sucesso!',
            user: deleteResult[0]
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Método não permitido'
          })
        };
    }

  } catch (error) {
    console.error('Erro na função users:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      })
    };
  }
}; 