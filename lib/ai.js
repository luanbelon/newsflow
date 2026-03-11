import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Decode numeric and named HTML entities (e.g. &#8220; → ", &amp; → &)
function decodeHtmlEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&mdash;/g, '\u2014');
}

// Remove common RSS footers like "The post X appeared first on Y."
function stripRssFooter(text) {
  return text
    .replace(/The post .+? appeared first on .+?\.?\s*$/i, '')
    .replace(/Leia mais em .+?\.?\s*$/i, '')
    .replace(/Veja mais em .+?\.?\s*$/i, '')
    .trim();
}

export async function rewriteArticle(title, content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const cleanContent = stripRssFooter(
      decodeHtmlEntities(
        content
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      )
    ).substring(0, 5000);

    const promptLines = [
      'Voce e um jornalista investigativo brasileiro experiente escrevendo para um grande portal de noticias. Crie uma MATERIA COMPLETA E ORIGINAL baseada nos fatos abaixo.',
      '',
      'REGRAS:',
      '- Materia 100% original, NUNCA copie frases da fonte',
      '- Entre 8 e 12 paragrafos bem desenvolvidos',
      '- Cada paragrafo com pelo menos 3 frases completas',
      '- Tom jornalistico profissional em portugues brasileiro',
      '- Comece com um lide forte',
      '- Desenvolva com profundidade: contexto, dados, analises, impacto',
      '- Perspectiva de especialistas quando apropriado',
      '- Conclua com perspectivas futuras',
      '- Titulo chamativo e jornalistico, diferente do original',
      '- Resumo: maximo 155 caracteres',
      '- Retorne SOMENTE JSON valido, sem markdown',
      '- Use ||| (tres barras verticais) como separador entre cada paragrafo no campo conteudo',
      '',
      'NOTICIA BASE:',
      `Titulo: ${title}`,
      `Conteudo: ${cleanContent}`,
      '',
      'Formato de retorno (use ||| entre paragrafos):',
      '{"titulo":"titulo aqui","conteudo":"paragrafo1|||paragrafo2|||paragrafo3","resumo":"resumo aqui"}',
    ];

    const prompt = promptLines.join('\n');

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    const cleanJson = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    // Convert ||| separator to \n\n for storage
    const rawContent = parsed.conteudo || content;
    const formattedContent = rawContent
      .split('|||')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .join('\n\n');

    return {
      title: parsed.titulo || title,
      content: formattedContent,
      summary: parsed.resumo || '',
    };
  } catch (error) {
    console.error('Erro na reescrita com IA:', error.message);
    // Fallback: return cleaned original
    const cleanContent = stripRssFooter(
      decodeHtmlEntities(content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
    );
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
