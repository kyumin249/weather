import { useEffect, useState } from 'react';
import { fetchLatestValidWeather, fetchUltraShortForecast, fetchLandForecast } from "../utils/WeatherApi";

const Home = () => {
  const [weatherData, setWeatherData] = useState({
    live: null,
    forecast: null,
    land: null,
    loading: true
  });

  useEffect(() => {
    const loadAllWeatherData = async () => {
      try {
        const [live, forecast, land] = await Promise.all([
          fetchLatestValidWeather('108'),
          fetchUltraShortForecast(55, 127),
          fetchLandForecast('11A00101')
        ]);

        setWeatherData({
          live: live.success ? live.data : null,
          forecast: forecast.success ? forecast : null, // { temperatures, sky } 객체
          land: land.success ? land.data : null,
          loading: false
        });
      } catch (error) {
        console.error("데이터 로딩 중 에러:", error);
        setWeatherData(prev => ({ ...prev, loading: false }));
      }
    };

    loadAllWeatherData();
  }, []);

  // 로딩 상태 처리
  if (weatherData.loading) return <div>날씨 정보를 가져오는 중입니다...</div>;

  return (
    <div>
      <h2>서울 실시간 관측 정보</h2>
      {weatherData.live ? (
        <ul>
          <li>현재 기온: {weatherData.live.temperature}°C</li>
          <li>상대 습도: {weatherData.live.humidity}%</li>
          <li>풍속: {weatherData.live.windSpeed} m/s</li>
          <li>강수량: {weatherData.live.precipitation} mm</li>
        </ul>
      ) : <p>관측 데이터를 불러올 수 없습니다.</p>}
      
      <h2>시간별 초단기 예측 (기온)</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {weatherData.forecast?.temperatures?.length > 0 ? (
          weatherData.forecast.temperatures.map((item, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
              <div>{item.time.substring(0, 2)}시</div>
              <div style={{ fontWeight: 'bold' }}>{item.value}°C</div>
            </div>
          ))
        ) : (
          <p>예측 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Home;