
import { useNavigate } from 'react-router-dom'; // 💡 라우터 이동을 위한 훅 임포트
import { FAVORITE_CITIES } from '../content/cities';

const CityPage = ({ currentCity, setCurrentCity }) => {
  const navigate = useNavigate(); // 💡 네비게이트 함수 선언

  return (
    <div>
      <h1 style={styles.pageTitle}>자주 보는 도시</h1>
      <p style={styles.subTitle}>지역을 클릭하면 메인 화면의 실시간 날씨가 즉시 변경됩니다.</p>
      
      <div style={styles.list}>
        {FAVORITE_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => {
              setCurrentCity(city);    // 1. App.jsx의 전역 도시 상태 변경
              navigate('/');           // 2. 💡 실시간 관측 정보 홈 주소('/')로 강제 이동!
            }}
            style={{
              ...styles.cityCard,
              border: currentCity.id === city.id ? '1px solid #4a90e2' : '1px solid #e2e8f0',
              backgroundColor: currentCity.id === city.id ? '#f0f7ff' : '#f8fafc'
            }}
          >
            <div style={styles.cityInfo}>
              <span style={styles.cityName}>{city.name}</span>
              <span style={styles.regionTag}>{city.region}</span>
            </div>
            {currentCity.id === city.id && <span style={styles.activeBadge}>선택됨</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageTitle: { fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#0f172a' },
  subTitle: { fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.4' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  cityCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', width: '100%' },
  cityInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  cityName: { fontSize: '15px', fontWeight: '600', color: '#1e293b' },
  regionTag: { fontSize: '11px', color: '#94a3b8' },
  activeBadge: { fontSize: '12px', color: '#4a90e2', fontWeight: 'bold' }
};

export default CityPage;