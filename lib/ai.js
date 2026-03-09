import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function rewriteArticle(title, content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const cleanContent = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000);

    const prompt = `Você é um jornalista investigativo brasileiro experiente escrevendo para um grande portal de notícias. Sua tarefa é criar uma MATÉRIA COMPLETA E ORIGINAL baseada nos fatos da notícia abaixo.

REGRAS OBRIGATÓRIAS:
- Escreva como se fosse uma matéria 100% original, NUNCA copie frases da fonte
- O texto deve ter entre 8 e 12 parágrafos bem desenvolvidos
- Cada parágrafo deve ter pelo menos 3 frases completas
- Use um tom jornalístico profissional, objetivo e envolvente em português brasileiro
- Comece com um lide (lead) forte que capture a atenção do leitor
- Desenvolva o assunto com profundidade, incluindo contexto, dados e análises
- Adicione contexto relevante sobre o tema (números, comparações, impacto)
- Inclua uma perspectiva de especialistas ou análise do impacto quando apropriado
- Conclua com perspectivas futuras ou desdobramentos esperados
- O título deve ser chamativo e jornalístico, diferente do original
- O resumo deve ter no máximo 155 caracteres
- Retorne APENAS um JSON válido, sem markdown, sem code blocks
- Separe cada parágrafo com \\n\\n

NOTÍCIA BASE:
Título: ${title}
Conteúdo: ${cleanContent}

Retorne EXATAMENTE neste formato JSON:
{"titulo": "novo título original e atrativo", "conteudo": "matéria completa com 8-12 parágrafos separados por \\n\\n", "resumo": "resumo curto de até 155 caracteres"}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    const cleanJson = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    return {
      title: parsed.titulo || title,
      content: parsed.conteudo || content,
      summary: parsed.resumo || '',
    };
  } catch (error) {
    console.error('Erro na reescrita com IA:', error.message);
    // Fallback: return cleaned original
    const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      title,
      content: cleanContent.substring(0, 2000),
      summary: cleanContent.substring(0, 155),
    };
  }
}

export async function categorizeArticle(title, content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Classifique esta notícia em UMA das categorias abaixo. Retorne APENAS o slug da categoria, nada mais.

Categorias: politica, economia, tecnologia, esportes, entretenimento, saude, ciencia, educacao, games, financas, internacional, brasil, automoveis, lifestyle, curiosidades

Título: ${title}
Conteúdo: ${content.substring(0, 500)}

Resposta (apenas o slug):`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim().toLowerCase();

    const validCategories = [
      'politica', 'economia', 'tecnologia', 'esportes', 'entretenimento',
      'saude', 'ciencia', 'educacao', 'games', 'financas',
      'internacional', 'brasil', 'automoveis', 'lifestyle', 'curiosidades'
    ];

    return validCategories.includes(category) ? category : 'geral';
  } catch (error) {
    console.error('Erro na categorização:', error.message);
    return 'geral';
  }
}
