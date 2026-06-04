import { useEffect, useState } from 'react';
// commit.png 구조에 맞게 대소문자를 구분하여 WeatherApi 유틸리티를 임포트합니다.
import { fetchLatestValidWeather, fetchUltraShortForecast } from '../utils/WeatherApi';

const WeatherPage = ({ currentCity, onNavigateToCities }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: '--', humidity: '--', windSpeed: '--', precipitation: '--'
  });
  // 초단기 예보(시간별 기온 및 하늘 상태)를 저장할 상태 추가
  const [forecastData, setForecastData] = useState({ temperatures: [], sky: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 실시간 지상 관측 데이터 호출 (지점 ID 사용)
        const currentRes = await fetchLatestValidWeather(currentCity.id);
        
        // 2. 초단기 예보 데이터 호출 (도시 객체의 격자 좌표 nx, ny 사용)
        // 만약 cities.js에 nx, ny가 없다면 유틸 내부에서 안전하게 서울 격자로 폴백됩니다.
        const forecastRes = await fetchUltraShortForecast(currentCity.nx, currentCity.ny);

        if (currentRes.success) {
          setWeatherData(currentRes.data);
        } else {
          throw new Error('실시간 날씨 데이터를 가져오지 못했습니다.');
        }

        if (forecastRes.success) {
          setForecastData({
            temperatures: forecastRes.temperatures,
            sky: forecastRes.sky
          });
        }
      } catch (err) {
        setError(err.message || '서버 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [currentCity]);

  if (loading) return <div style={styles.message}>데이터 로딩 중...</div>;
  if (error) return <div style={{ ...styles.message, color: '#ef4444' }}>{error}</div>;

  const isRainy = parseFloat(weatherData.precipitation) > 0;
  const skyText = isRainy ? '비 오는 중' : (parseFloat(weatherData.humidity) > 75 ? '흐림' : '맑음');

  return (
    <div style={styles.container}>
      {/* 날씨 메인 카드 */}
      <div style={{ ...styles.statusCard, backgroundColor: isRainy ? '#5c7cfa' : '#4a90e2' }}>
        <button onClick={onNavigateToCities} style={styles.changeCityBtn}>
          📍 다른 도시 보기
        </button>
        <div style={styles.overlay}>
          <h1 style={styles.statusTitle}>{skyText}</h1>
          <p style={styles.statusSub}>{currentCity.name.toUpperCase()}</p>
        </div>
      </div>

      <h2 style={styles.title}>{currentCity.name} 실시간 날씨 정보</h2>
      
      {/* 실시간 관측 그리드 */}
      <div style={styles.grid}>
        <div style={styles.card}><span style={styles.label}>현재 기온</span><span style={styles.value}>{weatherData.temperature}°C</span></div>
        <div style={styles.card}><span style={styles.label}>상대 습도</span><span style={styles.value}>{weatherData.humidity}%</span></div>
        <div style={styles.card}><span style={styles.label}>풍속</span><span style={styles.value}>{weatherData.windSpeed} m/s</span></div>
        <div style={styles.card}><span style={styles.label}>강수량</span><span style={styles.value}>{weatherData.precipitation} mm</span></div>
      </div>

      {/* ⏰ 새로 추가된 초단기 예보 타임라인 섹션 */}
      {forecastData.temperatures.length > 0 && (
        <div style={styles.forecastSection}>
          <h3 style={styles.subTitle}>⏳ 향후 시간별 예보</h3>
          <div style={styles.timeline}>
            {forecastData.temperatures.map((item, index) => {
              const skyItem = forecastData.sky[index];
              return (
                <div key={item.time} style={styles.timelineItem}>
                  <span style={styles.timelineTime}>{item.time}</span>
                  <span style={styles.timelineSky}>{skyItem ? skyItem.value : '맑음'}</span>
                  <span style={styles.timelineTemp}>{item.value}°C</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'sans-serif' },
  statusCard: { height: '220px', borderRadius: '16px', marginBottom: '25px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  changeCityBtn: { position: 'absolute', top: '15px', right: '15px', zIndex: 10, padding: '6px 12px', fontSize: '12px', color: '#fff', backgroundColor: 'rgba(25, 25, 25, 0.4)', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '500' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' },
  statusTitle: { margin: '0', fontSize: '36px', fontWeight: 'bold' },
  statusSub: { margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9, letterSpacing: '1px' },
  title: { fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' },
  card: { padding: '20px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  value: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a' },
  message: { textAlign: 'center', marginTop: '100px', fontSize: '16px', color: '#64748b' },
  
  // 타임라인 스타일 추가
  forecastSection: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' },
  subTitle: { fontSize: '15px', fontWeight: 'bold', marginTop: '0', marginBottom: '12px', color: '#475569' },
  timeline: { display: 'flex', justifyContent: 'space-between', gap: '10px' },
  timelineItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '8px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9' },
  timelineTime: { fontSize: '11px', color: '#94a3b8', marginBottom: '4px' },
  timelineSky: { fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '4px' },
  timelineTemp: { fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }
};

export default WeatherPage;