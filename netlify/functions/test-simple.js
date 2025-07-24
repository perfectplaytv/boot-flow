exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  // Teste simples sem conexão com banco
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Função simples funcionando!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
      noDatabase: true
    })
  };
}; 