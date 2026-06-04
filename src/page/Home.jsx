import { useEffect, useState } from 'react';
import { fetchLatestValidWeather, fetchUltraShortForecast } from '../utils/WeatherApi';

const Home = ({ currentCity }) => {
  const [weatherData, setWeatherData] = useState(null); // 초기값을 null로 설정
  const [loading, setLoading] = useState(true);
  const [ultraShortForecast, setUltraShortForecast] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      
      // 1. 관측 데이터 호출
      const res1 = await fetchLatestValidWeather(currentCity.id);
      if (res1?.success) setWeatherData(res1.data);
      
      // 2. 예보 데이터 호출
      const res2 = await fetchUltraShortForecast(currentCity.nx, currentCity.ny);
      setUltraShortForecast(Array.isArray(res2) ? res2 : []);
      
      setLoading(false);
    };
    getData();
  }, [currentCity]);

  if (loading) return <div>날씨 정보를 가져오는 중입니다...</div>;

  return (
    <div>
      <h2>{currentCity.name} 실시간 관측 정보</h2>
      {weatherData ? (
        <ul>
          <li>현재 기온: {weatherData.temperature}°C</li>
          <li>상대 습도: {weatherData.humidity}%</li>
          <li>풍속: {weatherData.windSpeed} m/s</li>
          <li>강수량: {weatherData.precipitation} mm</li>
        </ul>
      ) : <p>관측 데이터를 불러올 수 없습니다.</p>}
      
      <h2>시간별 초단기 예측 (기온)</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {ultraShortForecast.length > 0 ? (
          ultraShortForecast
            .filter(item => item.category === 'T1H')
            .slice(0, 4)
            .map((item, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                <div>{item.fcstTime.substring(0, 2)}시</div>
                <div style={{ fontWeight: 'bold' }}>{item.fcstValue}°C</div>
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