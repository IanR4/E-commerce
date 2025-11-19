import { Link } from 'react-router-dom';
import './Footer.css';
import '../../index.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-bg" role="contentinfo" aria-label="Pie de página">
      <nav className="footer" aria-label="Enlaces del pie de página">
        <div className="utilities">
          <Link to="/Contacto" className="link-no-style" aria-label="Ir a contacto">
            <h3 className="utilities-text">Contacto</h3>
          </Link>
          <Link to="/Nosotros" className="link-no-style" aria-label="Ir a nosotros">
            <h3 className="utilities-text">Nosotros</h3>
          </Link>
          <Link to="/FAQ" className="link-no-style" aria-label="Ir a preguntas frecuentes">
            <h3 className="utilities-text">FAQ</h3>
          </Link>
        </div>
      </nav>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Tienda Sol. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
