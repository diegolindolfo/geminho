// Importa o SDK do Google
import { GoogleGenerativeAI } from '@google/generative-ai';

// A função principal que a Netlify irá executar
export async function handler(event) {
  // Apenas permite requisições do tipo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Pega o prompt enviado pelo frontend
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'O prompt é obrigatório' }) };
    }

    // Inicializa o Gemini com a API Key guardada de forma segura na Netlify
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Retorna a resposta para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao gerar conteúdo' }),
    };
  }
}
