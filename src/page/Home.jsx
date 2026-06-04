import { useEffect, useState } from 'react';
import { fetchLatestValidWeather, fetchUltraShortForecast } from '../utils/WeatherApi';

// 💡 App.jsx가 넘겨준 currentCity 프로퍼티를 받습니다.
const Home = ({ currentCity }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: '--', humidity: '--', windSpeed: '--', precipitation: '--'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ultraShortForecast, setUltraShortForecast] = useState([]);

  const getWeatherIcon = (skyStatus) => {
    switch (skyStatus) {
      case '맑음': return '☀️';
      case '구름많음': return '⛅';
      case '흐림': return '☁️';
      default: return '✨';
    }
  };

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchLatestValidWeather(currentCity.id);
        
        try {
          if (typeof fetchUltraShortForecast === 'function') {
            const usf = await fetchUltraShortForecast(currentCity.nx, currentCity.ny);
            setUltraShortForecast(usf || []);
          }
        } catch  {
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

    getWeatherData();
  }, [currentCity]); 

  if (loading) return <div style={styles.message}>기상청 실시간 관측 데이터 동기화 중...</div>;
  if (error) return <div style={{ ...styles.message, color: '#ef4444' }}>{error}</div>;

  const isRainy = parseFloat(weatherData?.precipitation || '0') > 0;
  const currentHumidity = parseFloat(weatherData?.humidity || '50');
  const skyText = isRainy ? '비 오는 중' : (currentHumidity > 75 ? '흐림/습함' : '맑음/쾌적');

  return (
    <div>
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

      <h2 style={{ ...styles.title, marginTop: '30px' }}>시간별 초단기 예측 (4시간)</h2>
      <div style={styles.forecastRow}>
        {ultraShortForecast && ultraShortForecast.length > 0 ? (
          ultraShortForecast.map((item, index) => (
            <div key={index} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{item.time}</div>
              <div style={{ fontSize: '20px', margin: '6px 0 2px 0' }}>{getWeatherIcon(item.sky)}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{item.sky}</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb' }}>{item.value}°C</div>
            </div>
          ))
        ) : (
          <div style={{ fontSize: '12px', color: '#94a3b8', width: '100%', textAlign: 'center' }}>데이터 없음</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  statusCard: { height: '200px', borderRadius: '16px', marginBottom: '25px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' },
  statusTitle: { margin: '0', fontSize: '32px', fontWeight: 'bold' },
  statusSub: { margin: '6px 0 0 0', fontSize: '13px', opacity: 0.9, letterSpacing: '1px' },
  title: { fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  card: { padding: '20px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '12px', color: '#64748b', marginBottom: '6px' },
  value: { fontSize: '22px', fontWeight: 'bold', color: '#0f172a' },
  message: { textAlign: 'center', marginTop: '100px', fontSize: '15px', color: '#64748b' },
  forecastRow: { display: 'flex', justifyContent: 'space-between', padding: '15px 10px', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' }
};

export default Home;