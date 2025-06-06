const axios = require('axios');

async function askOpenAI() {
  const prompt = `
  Elabore 6 pequenos tópicos de curiosidades sobre em formato de notícias sobre Jaspion 
  e coisas relacionadas além da série, em formato de apresentação para um blog de noticias e curiosidades, 
  com titulo interessante e chamativo pra cada topico, 
  um slug único que vai ser usado no path entao coloque o titulo minusculo separado por hifen,
  um subtitulo que elabore mais sobre o texto,
  e o conteudo em si
  Retorne um JSON no formato [{slug, title, subtitle, content}]. 
  Não adicione quebras de linhas.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'Responda somente questões relacionadas ao Jaspion.' },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const message = response.data.choices[0].message.content.trim();

    return {
      answer: message,
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    console.error('❌ Erro na chamada à OpenAI:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Mensagem:', err.response.data?.error?.message || err.response.statusText);
    } else {
      console.error('Erro inesperado:', err.message);
    }

    throw new Error(err.response?.data?.error?.message || 'Erro inesperado na API OpenAI');
  }
}

module.exports = { askOpenAI };
