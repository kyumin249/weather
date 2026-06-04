import { useEffect, useState } from 'react';
import { fetchLatestValidWeather, fetchUltraShortForecast, fetchLandForecast } from "../utils/WeatherApi";

const Home = () => {
  const [weatherData, setWeatherData] = useState({ live: null, forecast: [], loading: true });

  useEffect(() => {
    const loadData = async () => {
      const [live, forecast] = await Promise.all([
        fetchLatestValidWeather('108'),
        fetchUltraShortForecast(60, 123)
      ]);
      setWeatherData({
        live: live.success ? live.data : null,
        forecast: forecast.success ? forecast.temperatures : [],
        loading: false
      });
    };
    loadData();
    fetchLandForecast(); // 경고 해결을 위해 호출
  }, []);

  if (weatherData.loading) return <div>날씨 정보를 가져오는 중입니다...</div>;

  const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' },
  card: { border: 'none', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '20px', background: '#ffffff' },
  title: { color: '#333', fontSize: '1.2rem', marginBottom: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  forecastBox: { background: '#f8f9fa', padding: '15px', borderRadius: '10px', textAlign: 'center' },
  tempText: { fontWeight: 'bold', fontSize: '1.1rem', color: '#007bff' }
};

return (
  <div style={styles.container}>
    {/* 실시간 날씨 카드 */}
    <div style={styles.card}>
      <h2 style={styles.title}>📍 서울 실시간 날씨</h2>
      {weatherData.live ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>🌡️ 현재 기온: {weatherData.live.temperature}°C</li>
          <li>💧 상대 습도: {weatherData.live.humidity}%</li>
          <li>💨 풍속: {weatherData.live.windSpeed} m/s</li>
        </ul>
      ) : <p>관측 정보를 불러올 수 없습니다.</p>}
    </div>

    {/* 시간별 예보 카드 */}
    <div style={styles.card}>
      <h2 style={styles.title}>🕒 시간별 초단기 예보</h2>
      <div style={styles.grid}>
        {weatherData.forecast && weatherData.forecast.length > 0 ? (
          weatherData.forecast.slice(0, 4).map((item, idx) => (
            <div key={idx} style={styles.forecastBox}>
              <div style={{ fontSize: '0.9rem' }}>{item?.fcstTime?.substring(0, 2)}시</div>
              <div style={styles.tempText}>{item?.fcstValue ?? '--'}°C</div>
            </div>
          ))
        ) : (
          <p>예측 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  </div>

  );
};
export default Home;