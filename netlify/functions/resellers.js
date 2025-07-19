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
    
    // Criar tabela de revendedores se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS resellers (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        force_password_change BOOLEAN DEFAULT false,
        permission VARCHAR(20) NOT NULL CHECK (permission IN ('admin', 'reseller', 'subreseller')),
        credits INTEGER NOT NULL DEFAULT 0,
        servers TEXT,
        master_reseller VARCHAR(100),
        disable_login_days INTEGER DEFAULT 0,
        monthly_reseller BOOLEAN DEFAULT false,
        personal_name VARCHAR(100),
        email VARCHAR(100),
        telegram VARCHAR(50),
        whatsapp VARCHAR(20),
        observations TEXT,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { httpMethod, body } = event;

    switch (httpMethod) {
      case 'GET':
        // Buscar todos os revendedores
        const resellers = await sql`SELECT * FROM resellers ORDER BY created_at DESC`;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            resellers,
            total: resellers.length
          })
        };

      case 'POST':
        // Criar novo revendedor
        const newReseller = JSON.parse(body);
        
        // Validações
        if (!newReseller.username || !newReseller.password || !newReseller.permission) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Usuário, senha e permissão são obrigatórios'
            })
          };
        }

        if (newReseller.username.length < 6) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'O usuário deve ter pelo menos 6 caracteres'
            })
          };
        }

        if (newReseller.password.length < 8) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'A senha deve ter pelo menos 8 caracteres'
            })
          };
        }

        if (newReseller.credits < 10) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Mínimo de 10 créditos é obrigatório'
            })
          };
        }

        const insertResult = await sql`
          INSERT INTO resellers (
            username, password, force_password_change, permission, credits, 
            servers, master_reseller, disable_login_days, monthly_reseller,
            personal_name, email, telegram, whatsapp, observations
          )
          VALUES (
            ${newReseller.username}, ${newReseller.password}, 
            ${newReseller.force_password_change || false}, 
            ${newReseller.permission}, ${newReseller.credits || 0},
            ${newReseller.servers || null}, ${newReseller.master_reseller || null},
            ${newReseller.disable_login_days || 0}, ${newReseller.monthly_reseller || false},
            ${newReseller.personal_name || null}, ${newReseller.email || null},
            ${newReseller.telegram || null}, ${newReseller.whatsapp || null},
            ${newReseller.observations || null}
          )
          RETURNING *
        `;
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Revendedor criado com sucesso!',
            reseller: insertResult[0]
          })
        };

      case 'PUT':
        // Atualizar revendedor
        const { id, ...updateData } = JSON.parse(body);
        
        const updateResult = await sql`
          UPDATE resellers 
          SET username = ${updateData.username}, 
              password = ${updateData.password},
              force_password_change = ${updateData.force_password_change || false},
              permission = ${updateData.permission},
              credits = ${updateData.credits || 0},
              servers = ${updateData.servers || null},
              master_reseller = ${updateData.master_reseller || null},
              disable_login_days = ${updateData.disable_login_days || 0},
              monthly_reseller = ${updateData.monthly_reseller || false},
              personal_name = ${updateData.personal_name || null},
              email = ${updateData.email || null},
              telegram = ${updateData.telegram || null},
              whatsapp = ${updateData.whatsapp || null},
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
              message: 'Revendedor não encontrado'
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Revendedor atualizado com sucesso!',
            reseller: updateResult[0]
          })
        };

      case 'DELETE':
        // Deletar revendedor
        const { id: deleteId } = JSON.parse(body);
        const deleteResult = await sql`
          DELETE FROM resellers WHERE id = ${deleteId} RETURNING *
        `;
        
        if (deleteResult.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Revendedor não encontrado'
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Revendedor deletado com sucesso!',
            reseller: deleteResult[0]
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
    console.error('Erro na função resellers:', error);
    
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