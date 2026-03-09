import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';

export default function Footer() {
  const col1 = CATEGORIES.slice(0, 5);
  const col2 = CATEGORIES.slice(5, 10);
  const col3 = CATEGORIES.slice(10, 15);

  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="footer-newsletter-text">
          📬 Fique por dentro das últimas notícias
          <span>Receba as principais notícias direto no seu email</span>
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">NEWS<span className="logo-accent">FLOW</span></div>
          <p>
            Seu portal de notícias completo. As últimas informações do Brasil e do mundo,
            24 horas por dia, com cobertura em todas as áreas.
          </p>
        </div>
        <div>
          <h4 className="footer-col-title">Categorias</h4>
          <ul className="footer-links">
            {col1.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categoria/${cat.slug}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="footer-col-title">Mais</h4>
          <ul className="footer-links">
            {col2.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categoria/${cat.slug}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="footer-col-title">Explore</h4>
          <ul className="footer-links">
            {col3.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categoria/${cat.slug}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NewsFlow. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
