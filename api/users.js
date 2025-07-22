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
    const sql = neon();
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

    switch (req.method) {
      case 'GET': {
        const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
        res.status(200).set(headers).json({ success: true, users, total: users.length });
        break;
      }
      case 'POST': {
        const newUser = req.body || req.body === '' ? req.body : JSON.parse(req.body);
        const insertResult = await sql`
          INSERT INTO users (name, email, password, m3u_url, bouquets, expiration_date, observations)
          VALUES (${newUser.name}, ${newUser.email}, ${newUser.password || null}, 
                  ${newUser.m3u_url || null}, ${newUser.bouquets || null}, 
                  ${newUser.expiration_date || null}, ${newUser.observations || null})
          RETURNING *
        `;
        res.status(201).set(headers).json({ success: true, message: 'Usuário criado com sucesso!', user: insertResult[0] });
        break;
      }
      case 'PUT': {
        const { id, ...updateData } = req.body || req.body === '' ? req.body : JSON.parse(req.body);
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
          res.status(404).set(headers).json({ success: false, message: 'Usuário não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Usuário atualizado com sucesso!', user: updateResult[0] });
        }
        break;
      }
      case 'DELETE': {
        const { id: deleteId } = req.body || req.body === '' ? req.body : JSON.parse(req.body);
        const deleteResult = await sql`
          DELETE FROM users WHERE id = ${deleteId} RETURNING *
        `;
        if (deleteResult.length === 0) {
          res.status(404).set(headers).json({ success: false, message: 'Usuário não encontrado' });
        } else {
          res.status(200).set(headers).json({ success: true, message: 'Usuário deletado com sucesso!', user: deleteResult[0] });
        }
        break;
      }
      default:
        res.status(405).set(headers).json({ success: false, message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na função users:', error);
    res.status(500).set(headers).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
} 