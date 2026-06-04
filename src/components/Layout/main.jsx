import { useEffect, useState } from 'react';
import { FAVORITE_CITIES } from '../../content/cities';
import { fetchLatestValidWeather, fetchUltraShortForecast } from '../../utils/WeatherApi';

// 💡 방금 만든 Week 컴포넌트를 불러옵니다. (경로는 실제 파일 위치에 맞게 조절하세요)
import Week from '../../page/week';
const Main = ({ view, onViewChange: setView }) => {
  const [currentCity, setCurrentCity] = useState(FAVORITE_CITIES[0]);
  const [weatherData, setWeatherData] = useState({
    temperature: '--', humidity: '--', windSpeed: '--', precipitation: '--'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ultraShortForecast, setUltraShortForecast] = useState([]);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchLatestValidWeather(currentCity.id);
        // 초단기 예보를 함께 가져옵니다. 없으면 빈 배열로 유지
        try {
          if (typeof fetchUltraShortForecast === 'function') {
            const usf = await fetchUltraShortForecast(currentCity.id);
            setUltraShortForecast(usf || []);
          }
        } catch {
          setUltraShortForecast([]);
        }
        if (result && result.success) {
          setWeatherData(result.data); 
        }
      } catch (err) {
        setError(err.message || '데이터를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (view === 'weather') {
      getWeatherData();
    }
  }, [currentCity, view]);

  // ==========================================
  // 화면 1: [frequently-city] 자주 보는 도시 설정 뷰
  // ==========================================
  if (view === 'cities') {
    return (
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>자주 보는 도시</h1>
        <p style={styles.subTitle}>지역을 클릭하면 메인 화면의 실시간 날씨가 즉시 변경됩니다.</p>
        
        <div style={styles.list}>
          {FAVORITE_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => {
                setCurrentCity(city); 
                setView('weather');
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
  }

// ==========================================
  // 화면 2: [week-weather] 주간 날씨 예보 뷰
  // ==========================================
  if (view === 'week') {
    return (
      <Week 
        currentCity={currentCity} 
        onViewChange={setView} 
      />
      
    );
  }

  // ==========================================
  // 화면 3: [Home] 실시간 기상 관측 대시보드 뷰
  // ==========================================
  if (loading) return <div style={styles.message}>기상청 실시간 관측 데이터 동기화 중...</div>;
  if (error) return <div style={{ ...styles.message, color: '#ef4444', lineHeight: '1.5' }}>{error}</div>;

  // 💡 Optional Chaining(?.)과 기본값을 부여하여 크래시 현상을 완벽 차단합니다.
  const isRainy = parseFloat(weatherData?.precipitation || '0') > 0;
  const currentHumidity = parseFloat(weatherData?.humidity || '50');
  const skyText = isRainy ? '비 오는 중' : (currentHumidity > 75 ? '흐림/습함' : '맑음/쾌적');

  return (
    <div style={styles.container}>
      <div style={{ ...styles.statusCard, backgroundColor: isRainy ? '#5c7cfa' : '#4a90e2' }}>
        <div style={styles.overlay}>
          <h1 style={styles.statusTitle}>{skyText}</h1>
          <p style={styles.statusSub}>{currentCity.name.toUpperCase()}</p>
        </div>
      </div>

      <h2 style={styles.title}>{currentCity.name} 실시간 관측 정보</h2>
      
      <div style={styles.grid}>
        <div style={styles.card}><span style={styles.label}>현재 기온</span><span style={styles.value}>{weatherData?.temperature ?? '--'}°C</span></div>
        <div style={styles.card}><span style={styles.label}>상대 습도</span><span style={styles.value}>{weatherData?.humidity ?? '--'}%</span></div>
        <div style={styles.card}><span style={styles.label}>풍속</span><span style={styles.value}>{weatherData?.windSpeed ?? '--'} m/s</span></div>
        <div style={styles.card}><span style={styles.label}>강수량</span><span style={styles.value}>{weatherData?.precipitation ?? '0'} mm</span></div>
      </div>

      {/* 👇 여기에 초단기 예측 UI를 추가했습니다! (no-unused-vars 에러 완벽 해결) */}
      <h2 style={{ ...styles.title, marginTop: '30px' }}>시간별 초단기 예측</h2>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '14px',
        border: '1px solid #e2e8f0' 
      }}>
        {ultraShortForecast && ultraShortForecast.length > 0 ? (
          ultraShortForecast.map((item, index) => (
            <div key={index} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{item.time}</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', margin: '4px 0' }}>{item.sky}</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4a90e2' }}>{item.temp}°C</div>
            </div>
          ))
        ) : (
          <div style={{ fontSize: '12px', color: '#94a3b8', width: '100%', textAlign: 'center' }}>
            시간별 데이터를 불러오는 중...
          </div>
        )}
      </div>

    </div>
  );
};

// CSS-in-JS 스타일 정의 객체
const styles = {
  container: { padding: '20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'sans-serif' },
  pageTitle: { fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#0f172a' },
  subTitle: { fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.4' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  cityCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' },
  cityInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  cityName: { fontSize: '15px', fontWeight: '600', color: '#1e293b' },
  regionTag: { fontSize: '11px', color: '#94a3b8' },
  activeBadge: { fontSize: '12px', color: '#4a90e2', fontWeight: 'bold' },
  statusCard: { height: '200px', borderRadius: '16px', marginBottom: '25px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' },
  statusTitle: { margin: '0', fontSize: '32px', fontWeight: 'bold' },
  statusSub: { margin: '6px 0 0 0', fontSize: '13px', opacity: 0.9, letterSpacing: '1px' },
  title: { fontSize: '17px', fontWeight: 'bold', marginBottom: '15px', color: '#333' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  card: { padding: '20px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '12px', color: '#64748b', marginBottom: '6px' },
  value: { fontSize: '22px', fontWeight: 'bold', color: '#0f172a' },
  message: { textAlign: 'center', marginTop: '100px', fontSize: '15px', color: '#64748b', padding: '0 20px' }
};

export default Main;