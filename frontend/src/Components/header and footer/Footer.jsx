import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import '../css/style.css'
import { Link } from 'react-router-dom';

function Footer(){
  return(
  <section id='footer'>
     <footer>
      
        <div className="copyright">
          <p>Copyright ©2025 HackLab. All rights reserved.</p>
          <div className="pro-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebookF} className="i"/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="i"/>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedinIn} className="i"/>
            </a>
          </div>
        </div>
        </footer>
      </section>
  )
}
export default Footer;