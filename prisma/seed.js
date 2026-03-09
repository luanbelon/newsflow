const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

const MOCK_ARTICLES = [
  // POLITICA
  {
    title: 'Governo anuncia novo pacote de investimentos em infraestrutura de R$ 120 bilhões',
    summary: 'O plano prevê obras em rodovias, ferrovias e portos ao longo dos próximos quatro anos, com foco nas regiões Norte e Nordeste.',
    content: 'O governo federal anunciou nesta terça-feira um ambicioso pacote de investimentos em infraestrutura no valor de R$ 120 bilhões, que será executado ao longo dos próximos quatro anos.\n\nO programa, batizado de "Brasil Conectado", prevê a construção e modernização de rodovias, ferrovias, portos e aeroportos em todo o país, com prioridade para as regiões Norte e Nordeste.\n\nSegundo o ministro da Infraestrutura, as obras devem gerar mais de 500 mil empregos diretos e indiretos. "Este é o maior programa de investimentos em infraestrutura da última década", afirmou o ministro durante a cerimônia de lançamento.\n\nEntre os projetos mais relevantes estão a duplicação de 3.500 km de rodovias federais, a construção de dois novos portos no litoral nordestino e a expansão da malha ferroviária em 1.200 km. O financiamento virá de uma combinação de recursos do Tesouro Nacional, parcerias público-privadas e financiamentos internacionais.',
    category: 'politica', sourceName: 'G1', sourceUrl: 'https://g1.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=500&fit=crop',
  },
  {
    title: 'STF retoma julgamento sobre reforma tributária na próxima semana',
    summary: 'Ministros vão analisar a constitucionalidade dos novos tributos propostos pelo governo.',
    content: 'O Supremo Tribunal Federal retomará na próxima semana o julgamento sobre a constitucionalidade da reforma tributária.\n\nOs ministros analisarão os principais pontos da proposta que unifica tributos federais em um único imposto sobre valor agregado.\n\nA expectativa é que o julgamento dure pelo menos três sessões. O relator já apresentou voto favorável à maior parte da reforma, mas com ressalvas sobre a alíquota máxima proposta.',
    category: 'politica', sourceName: 'UOL', sourceUrl: 'https://uol.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=500&fit=crop',
  },

  // ECONOMIA
  {
    title: 'Bolsa de Valores fecha em alta de 2,3% e renova recorde histórico',
    summary: 'O Ibovespa superou os 145 mil pontos pela primeira vez, impulsionado por resultados positivos do setor bancário.',
    content: 'O principal índice da bolsa brasileira fechou em forte alta nesta quarta-feira, renovando seu recorde histórico ao superar os 145 mil pontos.\n\nO Ibovespa avançou 2,3%, impulsionado principalmente pelos resultados trimestrais acima do esperado dos grandes bancos nacionais. As ações do Itaú subiram 4,5%, enquanto Bradesco avançou 3,8%.\n\nO dólar recuou 0,7% frente ao real, cotado a R$ 4,85. Analistas apontam que o cenário positivo deve se manter nas próximas semanas.\n\nInvestidores estrangeiros injetaram R$ 2,3 bilhões na bolsa brasileira apenas nesta sessão, demonstrando confiança crescente na economia do país.',
    category: 'economia', sourceName: 'InfoMoney', sourceUrl: 'https://infomoney.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop',
  },
  {
    title: 'Banco Central mantém taxa Selic em 10,5% ao ano em decisão unânime',
    summary: 'Comitê de Política Monetária sinalizou cautela diante do cenário internacional.',
    content: 'O Comitê de Política Monetária do Banco Central decidiu, por unanimidade, manter a taxa básica de juros em 10,5% ao ano.\n\nA decisão era amplamente esperada pelo mercado e reflete a cautela do BC diante das incertezas no cenário econômico global.\n\nNo comunicado, o Copom destacou a importância de manter a política monetária restritiva enquanto a inflação não convergir para a meta de forma sustentável.',
    category: 'economia', sourceName: 'Valor Econômico', sourceUrl: 'https://valor.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=500&fit=crop',
  },

  // TECNOLOGIA
  {
    title: 'Apple apresenta nova geração de chips M5 com inteligência artificial integrada',
    summary: 'O novo processador promete ser até 40% mais rápido que a geração anterior, com foco em tarefas de IA generativa.',
    content: 'A Apple revelou oficialmente a nova linha de processadores M5 durante evento realizado na sede da empresa em Cupertino, Califórnia.\n\nO novo chip traz avanços significativos em processamento de inteligência artificial, sendo capaz de executar modelos de linguagem de grande porte diretamente no dispositivo, sem necessidade de conexão com servidores na nuvem.\n\nA Neural Engine do M5 conta com 22 núcleos dedicados, o dobro da geração anterior, permitindo até 40% mais velocidade em tarefas de machine learning.\n\nOs primeiros produtos equipados com o M5 devem chegar ao mercado ainda neste trimestre, começando pelo MacBook Pro e pelo Mac Studio.',
    category: 'tecnologia', sourceName: 'TecMundo', sourceUrl: 'https://tecmundo.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=500&fit=crop',
  },
  {
    title: 'Google lança nova versão do Gemini capaz de processar vídeos em tempo real',
    summary: 'A atualização do Gemini 3.0 permite análise e compreensão de vídeos longos com contexto mantido por até 4 horas.',
    content: 'O Google anunciou a versão 3.0 do Gemini, seu modelo de inteligência artificial mais avançado, com capacidade inédita de processar e analisar vídeos em tempo real.\n\nA nova versão consegue manter contexto em vídeos de até 4 horas de duração, respondendo perguntas sobre qualquer momento específico da gravação.\n\nA tecnologia já está sendo integrada ao YouTube e ao Google Meet, permitindo que usuários façam perguntas sobre conteúdos em vídeo de forma natural.\n\nSegundo o CEO da empresa, Sundar Pichai, este é "o maior avanço em IA multimodal desde o lançamento do primeiro Gemini".',
    category: 'tecnologia', sourceName: 'Canaltech', sourceUrl: 'https://canaltech.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
  },
  {
    title: 'Tesla revela robô humanoide Optimus Gen 3 que já trabalha em fábricas',
    summary: 'Nova geração do robô é capaz de realizar tarefas complexas de montagem com precisão milimétrica.',
    content: 'Elon Musk apresentou a terceira geração do robô humanoide Optimus, que já está operando em linhas de montagem das fábricas da Tesla.\n\nO Optimus Gen 3 possui mãos com 22 graus de liberdade, permitindo manipular objetos delicados e realizar tarefas de montagem que antes exigiam operadores humanos especializados.\n\nSegundo a empresa, mais de 500 unidades do robô já estão em operação, e o plano é expandir para 10 mil unidades até o final do ano.',
    category: 'tecnologia', sourceName: 'Olhar Digital', sourceUrl: 'https://olhardigital.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop',
  },
  {
    title: 'Brasil ultrapassa 200 milhões de smartphones ativos pela primeira vez',
    summary: 'País registra crescimento de 8% no número de dispositivos móveis em relação ao ano anterior.',
    content: 'O Brasil atingiu a marca histórica de 200 milhões de smartphones ativos, segundo levantamento da FGV Tecnologia.\n\nO crescimento de 8% em relação ao ano anterior é puxado principalmente pela popularização de aparelhos intermediários com recursos avançados de câmera e conectividade 5G.\n\nA pesquisa também revela que 78% dos brasileiros usam o smartphone como principal dispositivo para acessar a internet.',
    category: 'tecnologia', sourceName: 'TecMundo', sourceUrl: 'https://tecmundo.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
  },

  // ESPORTES
  {
    title: 'Flamengo vence clássico por 3 a 1 e assume a liderança do Brasileirão',
    summary: 'Gols de Pedro, Arrascaeta e Gerson garantiram a vitória rubro-negra no Maracanã lotado.',
    content: 'O Flamengo venceu o clássico contra o Vasco por 3 a 1 neste domingo, no Maracanã, e assumiu a liderança isolada do Campeonato Brasileiro.\n\nPedro abriu o placar aos 15 minutos do primeiro tempo com um golaço de voleio. Arrascaeta ampliou ainda na primeira etapa com uma finalização de fora da área.\n\nO Vasco descontou no início do segundo tempo, mas Gerson fechou o placar aos 38 minutos, selando a vitória rubro-negra diante de mais de 65 mil torcedores.\n\nCom o resultado, o Flamengo chegou aos 34 pontos e abriu dois de vantagem sobre o Palmeiras, segundo colocado.',
    category: 'esportes', sourceName: 'GE', sourceUrl: 'https://ge.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop',
  },
  {
    title: 'Seleção Brasileira convoca 26 jogadores para as Eliminatórias',
    summary: 'Técnico aposta em renovação com três novidades entre os convocados para os jogos contra Argentina e Colômbia.',
    content: 'O técnico da Seleção Brasileira anunciou a lista de 26 jogadores convocados para os próximos jogos das Eliminatórias da Copa do Mundo.\n\nAs principais novidades são o atacante Estêvão, do Palmeiras, e o meio-campista João Pedro, que vive grande fase no futebol europeu.\n\nO Brasil enfrenta a Argentina em Buenos Aires no dia 15 e recebe a Colômbia em Brasília no dia 20. A seleção ocupa a terceira posição na tabela de classificação.',
    category: 'esportes', sourceName: 'ESPN', sourceUrl: 'https://espn.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
  },
  {
    title: 'Lewis Hamilton vence GP do Brasil em corrida emocionante sob chuva',
    summary: 'Piloto britânico conquistou sua 105ª vitória na carreira em Interlagos.',
    content: 'Lewis Hamilton venceu o Grande Prêmio do Brasil de Fórmula 1 em uma corrida marcada por chuva intensa e diversas mudanças de posição.\n\nO heptacampeão largou em quinto lugar e fez uma corrida impecável, aproveitando as condições adversas para ultrapassar os adversários.\n\nA vitória em Interlagos marca a 105ª da carreira de Hamilton e reforça sua ligação especial com o circuito paulistano, onde já venceu quatro vezes.',
    category: 'esportes', sourceName: 'GE', sourceUrl: 'https://ge.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=500&fit=crop',
  },
  {
    title: 'NBA: Lakers dominam Celtics em jogo histórico com 50 pontos de LeBron',
    summary: 'LeBron James alcançou a marca em partida emocionante que terminou com placar de 128 a 115.',
    content: 'LeBron James protagonizou uma noite mágica ao marcar 50 pontos na vitória dos Lakers sobre os Celtics por 128 a 115.\n\nAos 41 anos, LeBron se torna o jogador mais velho a atingir essa marca em um único jogo na história da NBA.\n\nA partida foi disputada no Crypto.com Arena em Los Angeles e contou com mais de 20 mil torcedores que presenciaram o feito histórico.',
    category: 'esportes', sourceName: 'ESPN', sourceUrl: 'https://espn.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop',
  },

  // ENTRETENIMENTO
  {
    title: 'Netflix anuncia série brasileira que já bateu recorde de audiência global',
    summary: 'A produção nacional superou 100 milhões de visualizações em apenas duas semanas de lançamento.',
    content: 'A Netflix anunciou que a série brasileira "Horizonte" se tornou a produção latino-americana mais assistida da história da plataforma.\n\nA série, que mistura ficção científica com drama social, ultrapassou 100 milhões de visualizações globais em apenas duas semanas após seu lançamento.\n\nDirigida por Fernando Meirelles, "Horizonte" conta a história de um Brasil futurista e aborda temas como desigualdade social e inteligência artificial.\n\nA Netflix já confirmou a renovação para uma segunda temporada, com produção prevista para começar no próximo semestre.',
    category: 'entretenimento', sourceName: 'UOL', sourceUrl: 'https://uol.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=500&fit=crop',
  },
  {
    title: 'Oscar 2026: filme brasileiro concorre em cinco categorias pela primeira vez',
    summary: 'A produção "Raízes" é a primeira obra nacional a competir em categorias técnicas além de Melhor Filme Internacional.',
    content: 'O filme brasileiro "Raízes" fez história ao ser indicado em cinco categorias do Oscar 2026, incluindo Melhor Direção e Melhor Roteiro Original.\n\nÉ a primeira vez que uma produção nacional concorre em categorias técnicas além de Melhor Filme Internacional.\n\nO longa metragem, dirigido por Kleber Mendonça Filho, conta uma história épica sobre três gerações de uma família no sertão nordestino.',
    category: 'entretenimento', sourceName: 'G1', sourceUrl: 'https://g1.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop',
  },

  // SAUDE
  {
    title: 'Cientistas brasileiros desenvolvem teste que detecta câncer em estágio inicial pelo sangue',
    summary: 'Exame utiliza inteligência artificial para identificar biomarcadores com 97% de precisão.',
    content: 'Pesquisadores da USP e da Unicamp desenvolveram um exame de sangue revolucionário capaz de detectar diversos tipos de câncer em estágio inicial.\n\nO teste utiliza algoritmos de inteligência artificial para analisar padrões de biomarcadores no sangue, alcançando uma taxa de precisão de 97% na identificação de tumores.\n\nO exame é capaz de detectar câncer de mama, pulmão, cólon, próstata e pâncreas até dois anos antes dos métodos diagnósticos tradicionais.\n\nA previsão é que o teste esteja disponível no SUS dentro de 18 meses, após a conclusão dos estudos clínicos de fase 3.',
    category: 'saude', sourceName: 'G1', sourceUrl: 'https://g1.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop',
  },
  {
    title: 'OMS alerta para novo surto de gripe aviária na Ásia e recomenda vigilância',
    summary: 'Organização pede que países reforcem monitoramento após casos detectados em três países.',
    content: 'A Organização Mundial da Saúde emitiu um alerta para um novo surto de gripe aviária H5N8 detectado em três países asiáticos.\n\nAté o momento, foram registrados 45 casos em humanos, com taxa de mortalidade de 15%. A OMS classifica o risco como "moderado a alto" e recomenda vigilância redobrada.\n\nO Brasil já ativou o protocolo de emergência sanitária em aeroportos internacionais e pontos de fronteira.',
    category: 'saude', sourceName: 'UOL', sourceUrl: 'https://uol.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=500&fit=crop',
  },

  // CIENCIA
  {
    title: 'Telescópio James Webb descobre exoplaneta com sinais de vida na atmosfera',
    summary: 'Planeta rochoso a 40 anos-luz contém oxigênio e metano em proporções compatíveis com atividade biológica.',
    content: 'O Telescópio Espacial James Webb fez uma descoberta que pode ser a mais significativa da história da astronomia: um exoplaneta com sinais químicos compatíveis com atividade biológica.\n\nO planeta, batizado de TRAPPIST-1g, orbita uma estrela anã vermelha a 40 anos-luz da Terra e possui atmosfera com oxigênio, metano e vapor de água em proporções que sugerem processos biológicos.\n\nCientistas alertam que mais observações são necessárias para confirmar a descoberta, mas classificam os resultados como "extremamente promissores".',
    category: 'ciencia', sourceName: 'Canaltech', sourceUrl: 'https://canaltech.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=500&fit=crop',
  },

  // EDUCACAO
  {
    title: 'MEC anuncia programa que oferecerá 500 mil bolsas de estudo em universidades privadas',
    summary: 'O novo programa substitui o ProUni com regas ampliadas e foco em áreas de tecnologia.',
    content: 'O Ministério da Educação lançou um novo programa de bolsas de estudo que prevê 500 mil vagas em universidades privadas ao longo dos próximos três anos.\n\nDiferente do ProUni, o novo programa inclui bolsas parciais de 30% a 100%, com critérios de renda mais flexíveis e prioridade para cursos nas áreas de tecnologia, engenharia e ciências da saúde.\n\nAs inscrições para o primeiro semestre começam em janeiro, e os candidatos devem ter participado do último Enem.',
    category: 'educacao', sourceName: 'G1', sourceUrl: 'https://g1.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&h=500&fit=crop',
  },

  // GAMES
  {
    title: 'GTA 6 bate recorde de pré-vendas com mais de 30 milhões de reservas no primeiro dia',
    summary: 'O jogo mais esperado da história dos games superou todas as expectativas da Rockstar Games.',
    content: 'Grand Theft Auto VI quebrou todos os recordes da indústria de games ao registrar mais de 30 milhões de pré-vendas nas primeiras 24 horas após a abertura das reservas.\n\nO jogo, ambientado em Vice City, uma versão fictícia de Miami, promete o maior mundo aberto já criado pela Rockstar Games, com mais de 500 km² de área explorável.\n\nO lançamento está previsto para o próximo mês, e analistas estimam que GTA 6 pode gerar mais de US$ 3 bilhões em receita apenas no primeiro ano.',
    category: 'games', sourceName: 'IGN Brasil', sourceUrl: 'https://br.ign.com',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
  },
  {
    title: 'Nintendo anuncia Switch 2 com tela OLED de 8 polegadas e suporte a 4K',
    summary: 'Novo console híbrido da Nintendo chega ao mercado com preço de US$ 399.',
    content: 'A Nintendo revelou oficialmente o Switch 2, seu novo console híbrido que combina jogos portáteis e de televisão.\n\nO aparelho conta com tela OLED de 8 polegadas, processador NVIDIA personalizado com suporte a 4K quando conectado à TV, e bateria com duração de até 6 horas.\n\nO catálogo de lançamento inclui um novo Mario Kart, Zelda e Metroid Prime 4. O console será lançado globalmente em abril.',
    category: 'games', sourceName: 'IGN Brasil', sourceUrl: 'https://br.ign.com',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=500&fit=crop',
  },
  {
    title: 'E-sports no Brasil movimenta R$ 2 bilhões e atrai investidores internacionais',
    summary: 'País se consolida como terceiro maior mercado de e-sports do mundo.',
    content: 'A indústria de e-sports no Brasil atingiu um faturamento de R$ 2 bilhões em 2025, consolidando o país como terceiro maior mercado mundial, atrás apenas de Estados Unidos e China.\n\nO crescimento de 35% em relação ao ano anterior atraiu investidores internacionais, com fundos de venture capital destinando mais de US$ 200 milhões para organizações brasileiras.\n\nO CBLOL, principal competição de League of Legends no país, registrou picos de 1,5 milhão de espectadores simultâneos.',
    category: 'games', sourceName: 'TecMundo', sourceUrl: 'https://tecmundo.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop',
  },
  {
    title: 'PlayStation 6: Sony confirma lançamento para 2027 com foco em realidade mista',
    summary: 'Próximo console terá processador AMD customizado e integração total com PSVR3.',
    content: 'A Sony confirmou durante o evento PlayStation Showcase que o PlayStation 6 chegará ao mercado em 2027.\n\nO console será equipado com um processador AMD customizado de última geração, SSD de 4 TB e terá integração nativa com o PSVR3, o novo headset de realidade mista da empresa.\n\nA empresa também revelou que o PS6 será retrocompatível com todos os jogos das gerações anteriores do PlayStation.',
    category: 'games', sourceName: 'Canaltech', sourceUrl: 'https://canaltech.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=500&fit=crop',
  },

  // FINANCAS
  {
    title: 'Bitcoin atinge novo recorde e supera US$ 120 mil pela primeira vez',
    summary: 'A criptomoeda acumula alta de 85% no ano, impulsionada pela aprovação de ETFs nos EUA.',
    content: 'O Bitcoin atingiu um novo recorde histórico ao ultrapassar a marca de US$ 120 mil nesta quinta-feira.\n\nA criptomoeda acumula uma valorização de 85% desde o início do ano, impulsionada pela aprovação de ETFs spot nos Estados Unidos e pela crescente adoção institucional.\n\nAnalistas apontam que o fluxo de investimentos em ETFs de Bitcoin já ultrapassou US$ 50 bilhões, com grandes gestoras como BlackRock e Fidelity liderando os aportes.\n\nO Ethereum também registrou ganhos expressivos, subindo 12% na semana e se aproximando dos US$ 8 mil.',
    category: 'financas', sourceName: 'InfoMoney', sourceUrl: 'https://infomoney.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=500&fit=crop',
  },
  {
    title: 'Pix bate recorde com 250 milhões de transações em um único dia',
    summary: 'Sistema de pagamentos instantâneos do Banco Central consolida-se como método preferido dos brasileiros.',
    content: 'O Pix registrou um novo recorde de utilização ao processar 250 milhões de transações em um único dia.\n\nO sistema de pagamentos instantâneos do Banco Central já é utilizado por mais de 160 milhões de brasileiros e responde por 45% de todas as transações financeiras realizadas no país.\n\nO volume financeiro movimentado no dia recorde foi de R$ 180 bilhões. O Banco Central planeja lançar novas funcionalidades, incluindo Pix por aproximação.',
    category: 'financas', sourceName: 'Valor Econômico', sourceUrl: 'https://valor.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
  },

  // INTERNACIONAL
  {
    title: 'União Europeia aprova regulamentação histórica para inteligência artificial',
    summary: 'Lei estabelece regras rígidas para uso de IA, com multas de até 7% do faturamento global para empresas que descumprirem.',
    content: 'O Parlamento Europeu aprovou por ampla maioria a regulamentação mais abrangente do mundo para inteligência artificial.\n\nA lei classifica os sistemas de IA em quatro níveis de risco e estabelece regras específicas para cada categoria, incluindo transparência obrigatória, avaliações de impacto e supervisão humana.\n\nEmpresas que descumprirem as normas poderão ser multadas em até 7% de seu faturamento global anual. As big techs terão 24 meses para se adequar às novas regras.',
    category: 'internacional', sourceName: 'BBC', sourceUrl: 'https://bbc.com',
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=500&fit=crop',
  },

  // BRASIL
  {
    title: 'Amazônia registra menor taxa de desmatamento em 15 anos graças a novas tecnologias de monitoramento',
    summary: 'Satélites de última geração e IA são usados para detectar desmatamento ilegal em tempo real.',
    content: 'A Amazônia brasileira registrou a menor taxa de desmatamento dos últimos 15 anos, segundo dados do INPE.\n\nA redução de 42% em relação ao ano anterior é atribuída ao uso de satélites de última geração combinados com algoritmos de inteligência artificial que detectam atividades ilegais em tempo real.\n\nO sistema alerta automaticamente as autoridades ambientais quando identifica áreas sob risco, permitindo ações de fiscalização em até 48 horas.',
    category: 'brasil', sourceName: 'G1', sourceUrl: 'https://g1.globo.com',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=500&fit=crop',
  },

  // AUTOMOVEIS
  {
    title: 'BYD ultrapassa Volkswagen e se torna a marca mais vendida no Brasil',
    summary: 'Montadora chinesa de elétricos registrou crescimento de 320% nas vendas neste ano.',
    content: 'A montadora chinesa BYD ultrapassou a Volkswagen e se tornou a marca automotiva mais vendida no Brasil pela primeira vez na história.\n\nCom crescimento de 320% nas vendas em 2025, a BYD vendeu mais de 450 mil veículos elétricos e híbridos no país, superando os 420 mil da VW.\n\nA fábrica da BYD em Camaçari, na Bahia, já opera com três turnos e planeja dobrar sua capacidade produtiva para atender à demanda crescente.',
    category: 'automoveis', sourceName: 'UOL Carros', sourceUrl: 'https://uol.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=500&fit=crop',
  },

  // LIFESTYLE
  {
    title: 'Pesquisa revela que trabalho remoto melhora saúde mental e produtividade',
    summary: 'Estudo com 50 mil profissionais mostra que trabalhadores remotos são 23% mais produtivos.',
    content: 'Uma pesquisa conduzida pela Universidade de Stanford com mais de 50 mil profissionais revelou que o trabalho remoto está associado a melhoras significativas na saúde mental e na produtividade.\n\nOs trabalhadores remotos reportaram 23% mais produtividade, 35% menos estresse e 40% mais satisfação com o equilíbrio entre vida pessoal e profissional.\n\nO estudo também mostrou que empresas que adotaram o modelo híbrido tiveram 25% menos turnover de funcionários.',
    category: 'lifestyle', sourceName: 'UOL', sourceUrl: 'https://uol.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
  },

  // CURIOSIDADES
  {
    title: 'Cidade flutuante sustentável abrirá para moradores na Arábia Saudita em 2027',
    summary: 'Projeto OXAGON será a primeira cidade industrial flutuante do mundo, totalmente alimentada por energia renovável.',
    content: 'A Arábia Saudita anunciou que o projeto OXAGON, a primeira cidade industrial flutuante do mundo, começará a receber seus primeiros moradores em 2027.\n\nA estrutura octagonal, localizada no Mar Vermelho, terá capacidade para 90 mil moradores e será totalmente alimentada por energia solar e eólica.\n\nO projeto inclui fábricas automatizadas, centros de pesquisa, áreas residenciais com jardins verticais e um sistema de transporte por veículos autônomos.\n\nO investimento total no projeto é estimado em US$ 48 bilhões.',
    category: 'curiosidades', sourceName: 'Olhar Digital', sourceUrl: 'https://olhardigital.com.br',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop',
  },
];

async function seed() {
  console.log('🌱 Seeding mock articles...');
  
  for (let i = 0; i < MOCK_ARTICLES.length; i++) {
    const a = MOCK_ARTICLES[i];
    const slug = slugify(a.title) + '-' + Date.now().toString(36) + i;
    const publishedAt = new Date(Date.now() - (i * 30 * 60 * 1000)); // 30min apart

    await prisma.article.create({
      data: {
        title: a.title,
        slug: slug,
        summary: a.summary,
        content: a.content,
        category: a.category,
        imageUrl: a.imageUrl,
        sourceName: a.sourceName,
        sourceUrl: a.sourceUrl,
        sourceHash: `mock-${slug}`,
        publishedAt: publishedAt,
        isPublished: true,
      },
    });
    console.log(`  ✅ [${a.category}] ${a.title.slice(0, 60)}...`);
  }

  console.log(`\n🎉 ${MOCK_ARTICLES.length} artigos criados com sucesso!`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
