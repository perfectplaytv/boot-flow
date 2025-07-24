export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL M3U não informada.' });
  }

  // Simulação: normalmente você faria um fetch na URL e processaria o conteúdo M3U
  // Aqui retornamos dados fictícios para teste
  return res.status(200).json({
    name: 'Cliente IPTV',
    email: 'cliente@exemplo.com',
    password: 'senha123',
    bouquets: 'Filmes, Séries, Esportes',
    expirationDate: '2024-12-31'
  });
} 