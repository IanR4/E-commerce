import { Link } from 'react-router-dom';
import './Footer.css';
import '../../index.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-bg">
      <nav className="footer">
        <div className="utilities">
          <h4 style={{ marginTop: 0, color: '#3498db' }}>
            Información
          </h4>
          <Link to="/Contacto" className="link-no-style">
            <h3 className="utilities-text">Contacto</h3>
          </Link>
          <Link to="/Nosotros" className="link-no-style">
            <h3 className="utilities-text">Nosotros</h3>
          </Link>
          <Link to="/FAQ" className="link-no-style">
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
