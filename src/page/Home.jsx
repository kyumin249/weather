import { useEffect, useState } from 'react';
import { fetchLatestValidWeather, fetchUltraShortForecast } from '../utils/WeatherApi';

const Home = ({ currentCity }) => {
  const [weatherData, setWeatherData] = useState({ 
    temperature: '--', 
    humidity: '--', 
    windSpeed: '--', 
    precipitation: '--' 
  });
  const [loading, setLoading] = useState(true);
  const [ultraShortForecast, setUltraShortForecast] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      // 데이터 호출
      const res1 = await fetchLatestValidWeather(currentCity.id);
      const res2 = await fetchUltraShortForecast(currentCity.nx, currentCity.ny);
      
      // 관측 데이터 저장
      if (res1.success) setWeatherData(res1.data);
      
      // 초단기 예보 데이터 저장 (데이터 구조 안전하게 접근)
      // 보통 res2는 객체 구조이므로 item 배열을 찾아 저장합니다.
      const forecastArray = Array.isArray(res2) ? res2 : (res2?.response?.body?.items?.item || []);
      setUltraShortForecast(forecastArray);
      
      setLoading(false);
    };
    getData();
  }, [currentCity]);

  if (loading) return <div>데이터 로딩 중...</div>;

  return (
    <div>
      <h2>{currentCity.name} 실시간 관측 정보</h2>
      <ul>
        <li>현재 기온: {weatherData.temperature}°C</li>
        <li>상대 습도: {weatherData.humidity}%</li>
        <li>풍속: {weatherData.windSpeed} m/s</li>
        <li>강수량: {weatherData.precipitation} mm</li>
      </ul>
      
      <h2>시간별 초단기 예측 (기온)</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {ultraShortForecast.length > 0 ? (
          ultraShortForecast
            .filter(item => item.category === 'T1H') // 'T1H'는 기온 카테고리
            .slice(0, 4)
            .map((item, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '12px' }}>{item.fcstTime.substring(0, 2)}시</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.fcstValue}°C</div>
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