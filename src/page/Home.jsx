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

  return (
    <div>
      <h2>실시간 관측 정보</h2>
      {weatherData.live ? (
        <ul>
          <li>현재 기온: {weatherData.live.temperature}°C</li>
          <li>상대 습도: {weatherData.live.humidity}%</li>
        </ul>
      ) : <p>관측 데이터를 불러올 수 없습니다.</p>}
      
      <h2>시간별 초단기 예측 (기온)</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {weatherData.forecast.length > 0 ? (
          weatherData.forecast.slice(0, 4).map((item, idx) => (
            <div key={idx} style={{ border: '1px solid #ddd', padding: '10px' }}>
              <div>{item?.fcstTime?.substring(0, 2) || '--'}시</div>
              <div>{item?.fcstValue ?? '--'}°C</div>
            </div>
          ))
        ) : <p>예측 데이터가 없습니다.</p>}
      </div>
    </div>
  );
};
export default Home;