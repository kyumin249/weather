import { NavLink } from 'react-router-dom';
import './header.css'; // 기존 CSS 파일 유지

function Header() {
  return (
    <header style={styles.header}>
      <NavLink 
        to="/" 
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.activeLink : {})
        })}
      >
        홈
      </NavLink>
      
      <NavLink 
        to="/cities" 
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.activeLink : {})
        })}
      >
        자주 찾는 도시
      </NavLink>
      
      <NavLink 
        to="/week" 
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.activeLink : {})
        })}
      >
        주간 날씨
      </NavLink>
    </header>
  );
}

// 🎨 Main.jsx와 완벽히 매칭되는 테마 스타일 정의
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
    textDecoration: 'none',
    color: '#64748b', // 기본 비활성화 탭 색상 (슬레이트 그레이)
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.2s ease-in-out'
  },
  activeLink: {
    backgroundColor: '#f0f7ff', // 선택된 탭 배경 (연한 블루)
    color: '#4a90e2'            // 선택된 탭 글자색 (기상청 메인 블루)
  }
};

export default Header;
