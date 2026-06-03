import './header.css';

function Header({ currentView, onViewChange }) {
  return (
    <header>
        <ul>
            <li className="logo" onClick={() => onViewChange('weather')} style={{ cursor: 'pointer' }}>
                <img src="/weather.svg" alt="Sun" />
                SkyCast
            </li>
            {/* Home 클릭 시 'weather' 뷰로 전환 */}
            <li 
              className={`urls1 ${currentView === 'weather' ? 'active' : ''}`}
              onClick={() => onViewChange('weather')}
              style={{ cursor: 'pointer' }}
            >
              Home
            </li>
            {/* frequently-city 클릭 시 'cities' 뷰로 전환 */}
            <li 
              className={`urls2 ${currentView === 'cities' ? 'active' : ''}`}
              onClick={() => onViewChange('cities')}
              style={{ cursor: 'pointer' }}
            >
              frequently-city
            </li>
            {/* week-weather 클릭 시 'week' 뷰로 전환 */}
            <li 
              className={`urls3 ${currentView === 'week' ? 'active' : ''}`}
              onClick={() => onViewChange('week')}
              style={{ cursor: 'pointer' }}
            >
              week-weather
            </li>
        </ul>
    </header>
  );
}

export default Header;
