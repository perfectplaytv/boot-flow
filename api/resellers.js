import { neon } from '@netlify/neon';

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
    if (!process.env.NETLIFY_DATABASE_URL) {
      res.status(500).set(headers).json({
        success: false,
        message: 'Variável de ambiente NETLIFY_DATABASE_URL não encontrada',
        error: 'Database configuration missing'
      });
      return;
    }
    const sql = neon();
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

    switch (req.method) {
      case 'GET': {
        const resellers = await sql`SELECT * FROM resellers ORDER BY created_at DESC`;
        res.status(200).set(headers).json({ success: true, resellers, total: resellers.length });
        break;
      }
      case 'POST': {
        const newReseller = req.body || req.body === '' ? req.body : JSON.parse(req.body);
        if (!newReseller.username || !newReseller.password || !newReseller.permission) {
          res.status(400).set(headers).json({ success: false, message: 'Usuário, senha e permissão são obrigatórios' });
          break;
        }
        if (newReseller.username.length < 6) {
          res.status(400).set(headers).json({ success: false, message: 'O usuário deve ter pelo menos 6 caracteres' });
          break;
        }
        if (newReseller.password.length < 8) {
          res.status(400).set(headers).json({ success: false, message: 'A senha deve ter pelo menos 8 caracteres' });
          break;
        }
        if (newReseller.credits < 10) {
          res.status(400).set(headers).json({ success: false, message: 'Mínimo de 10 créditos é obrigatório' });
          break;
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
        res.status(201).set(headers).json({ success: true, message: 'Revendedor criado com sucesso!', reseller: insertResult[0] });
        break;
      }
      case 'PUT': {
        const { id, ...updateData } = req.body || req.body === '' ? req.body : JSON.parse(req.body);
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
          res.status(404).set(headers).json({ success: false, message: 'Revendedor não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Revendedor atualizado com sucesso!', reseller: updateResult[0] });
        }
        break;
      }
      case 'DELETE': {
        const { id: deleteId } = req.body || req.body === '' ? req.body : JSON.parse(req.body);
        const deleteResult = await sql`
          DELETE FROM resellers WHERE id = ${deleteId} RETURNING *
        `;
        if (deleteResult.length === 0) {
          res.status(404).set(headers).json({ success: false, message: 'Revendedor não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Revendedor deletado com sucesso!', reseller: deleteResult[0] });
        }
        break;
      }
      default:
        res.status(405).set(headers).json({ success: false, message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na função resellers:', error);
    res.status(500).set(headers).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
} 