import  { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherPage = ({ currentCity, onNavigateToCities }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: '--', humidity: '--', windSpeed: '--', precipitation: '--'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getObservTime = () => {
    const now = new Date();
    now.setHours(now.getHours() - 2); // 2시간 전 안전 슬롯
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    return { date: `${year}${month}${day}`, hour };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const AUTH_KEY = 'a36646983d6f22d35479f4c6f89b15aa734627b67d45ad3bd7f0077a4479db1a';
        const tm = getObservTime();

        const baseUrl = `/api-weather/1360000/AsosHourlyInfoService/getWthrDataList?serviceKey=${AUTH_KEY}`;
        const response = await axios.get(baseUrl, {
          params: {
            dataType: 'JSON', dataCd: 'ASOS', dateCd: 'HR',
            startDt: tm.date, startH: tm.hour, endDt: tm.date, endH: tm.hour,
            stnIds: currentCity.id, pageNo: '1', numOfRows: '10'
          }
        });

        const resBody = response.data?.response?.body;
        if (!resBody || !resBody.items) {
          setError('기상청 서버에서 데이터를 가져오지 못했습니다.');
          return;
        }

        const rawItem = resBody.items.item;
        let currentObs = Array.isArray(rawItem) ? rawItem[0] : rawItem;

        if (currentObs) {
          setWeatherData({
            temperature: currentObs.ta || '0',
            humidity: currentObs.hm || '0',
            windSpeed: currentObs.ws || '0',
            precipitation: (currentObs.rn === '' || currentObs.rn === '0.0') ? '0' : currentObs.rn
          });
        }
      } catch {
        setError('서버 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [currentCity]); // 도시가 바뀔 때마다 날씨 새로 불러오기

  if (loading) return <div style={styles.message}>데이터 로딩 중...</div>;
  if (error) return <div style={{ ...styles.message, color: '#ef4444' }}>{error}</div>;

  const isRainy = parseFloat(weatherData.precipitation) > 0;
  const skyText = isRainy ? '비 오는 중' : (parseFloat(weatherData.humidity) > 75 ? '흐림' : '맑음');

  return (
    <div style={styles.container}>
      {/* 날씨 메인 카드 - 우상단에 페이지 전환 버튼 배치 */}
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
      
      <div style={styles.grid}>
        <div style={styles.card}><span style={styles.label}>현재 기온</span><span style={styles.value}>{weatherData.temperature}°C</span></div>
        <div style={styles.card}><span style={styles.label}>상대 습도</span><span style={styles.value}>{weatherData.humidity}%</span></div>
        <div style={styles.card}><span style={styles.label}>풍속</span><span style={styles.value}>{weatherData.windSpeed} m/s</span></div>
        <div style={styles.card}><span style={styles.label}>강수량</span><span style={styles.value}>{weatherData.precipitation} mm</span></div>
      </div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  card: { padding: '20px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  value: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a' },
  message: { textAlign: 'center', marginTop: '100px', fontSize: '16px', color: '#64748b' }
};

export default WeatherPage;