import './globals.css';

export const metadata = {
  title: 'NewsFlow - Portal de Notícias',
  description: 'As últimas notícias do Brasil e do mundo. Tecnologia, esportes, games, finanças, entretenimento e muito mais.',
  keywords: 'notícias, brasil, tecnologia, esportes, games, finanças, política, economia',
  openGraph: {
    title: 'NewsFlow - Portal de Notícias',
    description: 'As últimas notícias do Brasil e do mundo.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
