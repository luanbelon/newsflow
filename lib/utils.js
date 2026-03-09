export const CATEGORIES = [
  { slug: 'politica', name: 'Política', icon: '', color: '#6366f1' },
  { slug: 'economia', name: 'Economia', icon: '', color: '#f59e0b' },
  { slug: 'tecnologia', name: 'Tecnologia', icon: '', color: '#3b82f6' },
  { slug: 'esportes', name: 'Esportes', icon: '', color: '#10b981' },
  { slug: 'entretenimento', name: 'Entretenimento', icon: '', color: '#ec4899' },
  { slug: 'saude', name: 'Saúde', icon: '', color: '#14b8a6' },
  { slug: 'ciencia', name: 'Ciência', icon: '', color: '#8b5cf6' },
  { slug: 'educacao', name: 'Educação', icon: '', color: '#f97316' },
  { slug: 'games', name: 'Games', icon: '', color: '#ef4444' },
  { slug: 'financas', name: 'Finanças', icon: '', color: '#22c55e' },
  { slug: 'internacional', name: 'Internacional', icon: '', color: '#06b6d4' },
  { slug: 'brasil', name: 'Brasil', icon: '', color: '#eab308' },
  { slug: 'automoveis', name: 'Automóveis', icon: '', color: '#64748b' },
  { slug: 'lifestyle', name: 'Lifestyle', icon: '', color: '#d946ef' },
  { slug: 'curiosidades', name: 'Curiosidades', icon: '', color: '#f43f5e' },
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || { slug: 'geral', name: 'Geral', icon: '', color: '#6b7280' };
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return past.toLocaleDateString('pt-BR');
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const DEFAULT_FEEDS = [
  // Geral / Brasil
  { name: 'G1', url: 'https://g1.globo.com/rss/g1/', category: 'brasil' },
  { name: 'UOL Notícias', url: 'https://rss.uol.com.br/feed/noticias.xml', category: 'brasil' },
  { name: 'R7', url: 'https://noticias.r7.com/feed.xml', category: 'brasil' },
  { name: 'CNN Brasil', url: 'https://www.cnnbrasil.com.br/feed/', category: 'brasil' },
  { name: 'Folha', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml', category: 'brasil' },
  // Tecnologia
  { name: 'TecMundo', url: 'https://rss.tecmundo.com.br/feed', category: 'tecnologia' },
  { name: 'Olhar Digital', url: 'https://olhardigital.com.br/feed/', category: 'tecnologia' },
  { name: 'Tecnoblog', url: 'https://tecnoblog.net/feed/', category: 'tecnologia' },
  { name: 'Canaltech', url: 'https://canaltech.com.br/rss/', category: 'tecnologia' },
  // Games
  { name: 'IGN Brasil', url: 'https://br.ign.com/feed.xml', category: 'games' },
  { name: 'The Enemy', url: 'https://www.theenemy.com.br/feed', category: 'games' },
  { name: 'Voxel', url: 'https://www.voxel.com.br/feed/', category: 'games' },
  // Esportes
  { name: 'GE', url: 'https://ge.globo.com/rss/ge/', category: 'esportes' },
  { name: 'ESPN Brasil', url: 'https://www.espn.com.br/feed', category: 'esportes' },
  { name: 'Lance', url: 'https://www.lance.com.br/feed/', category: 'esportes' },
  // Finanças
  { name: 'InfoMoney', url: 'https://www.infomoney.com.br/feed/', category: 'financas' },
  { name: 'Valor Econômico', url: 'https://pox.globo.com/rss/valor/', category: 'financas' },
  // Entretenimento
  { name: 'Omelete', url: 'https://www.omelete.com.br/feed', category: 'entretenimento' },
];
