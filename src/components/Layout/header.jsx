import './header.css';
import { Link } from 'react-router-dom';
function Header( ) {
  return (
    <header>
        <Link to="/">홈</Link>
        <Link to="/cities">자주 찾는 도시</Link>
        <Link to="/week">주간 날씨</Link>
    </header>
  );
}

export default Header;
