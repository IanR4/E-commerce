import { Link } from 'react-router-dom';
import './Footer.css';
import '../../index.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-bg" anchor="bottom">
      {/* Footer links (single area used for both desktop and mobile) */}
      <div className="footer-links" role="navigation" aria-label="Footer links">
        <Link to="/Contacto" className="footer-link">Contacto</Link>
        <Link to="/Nosotros" className="footer-link">Nosotros</Link>
        <Link to="/FAQ" className="footer-link">FAQ</Link>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Tienda Sol. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
