import { NavLink } from 'react-router-dom';
import { Home as HomeIcon, MapPin, CalendarDays } from 'lucide-react'; // 아이콘 임포트
import './header.css';

function header() {
  return (
    <header style={styles.header}>
      <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', imgSrc: '/assets/weather.svg' }}> 오늘의 날씨</h1>
      <NavLink 
        to="/" 
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.activeLink : {})
        })}
      >
        <HomeIcon size={16} />
        <span>홈</span>
      </NavLink>
      
      <NavLink 
        to="/cities" 
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.activeLink : {})
        })}
      >
        <MapPin size={16} />
        <span>자주 찾는 도시</span>
      </NavLink>
      
      <NavLink 
        to="/week" 
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.activeLink : {})
        })}
      >
        <CalendarDays size={16} />
        <span>주간 날씨</span>
      </NavLink>
    </header>
  );
}

// 🎨 기존 스타일에 아이콘 정렬용 flex와 gap 추가
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 10px',
    maxWidth: '450px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    fontFamily: 'sans-serif'
  },
  link: {
    display: 'flex',       // 아이콘과 글자를 가로로 정렬
    alignItems: 'center',   // 상하 중앙 정렬
    gap: '6px',            // 아이콘과 글자 사이의 간격
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '20px',
    transition: 'all 0.2s ease-in-out'
  },
  activeLink: {
    backgroundColor: '#f0f7ff',
    color: '#4a90e2'
  }
};

export default header;
