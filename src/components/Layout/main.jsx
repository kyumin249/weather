
import axios from 'axios';
import { useEffect, useState } from 'react';
import './main.css';

const Main = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: '--',  
    humidity: '--',     
    windSpeed: '--',    
    precipitation: '--' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getObservTime = () => {
    const now = new Date();
    
    // [보안책] 정시 데이터 동기화 지연을 완벽하게 피하기 위해 안전하게 '2시간 전' 데이터를 요청합니다.
    now.setHours(now.getHours() - 4);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // [핵심 교정] 시간 정보가 항상 2자리(예: 01, 09, 23)를 유지하도록 padStart 처리
    const hour = String(now.getHours()).padStart(2, '0');

    return {
      date: `${year}${month}${day}`,
      hour: hour
    };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // 스크린샷에 나온 사용자님의 인증키
        const AUTH_KEY = 'a36646983d6f22d35479f4c6f89b15aa734627b67d45ad3bd7f0077a4479db1a'; 
        const tm = getObservTime();

        // 파라미터 덤프 확인용 로그
        console.log(`기상청 찌르는 타겟 날짜: ${tm.date}, 타겟 시간: ${tm.hour}`);

        // 서비스 키 오류를 피하기 위해 URL 뒤에 직접 결합
        const baseUrl = `/api-weather/1360000/AsosHourlyInfoService/getWthrDataList?serviceKey=${AUTH_KEY}`;

        const response = await axios.get(baseUrl, {
          params: {
            dataType: 'JSON',     
            dataCd: 'ASOS',
            dateCd: 'HR',
            startDt: tm.date,     
            startH: tm.hour,   // 2자리 보장 필드 기입
            endDt: tm.date,       
            endH: tm.hour,     // 2자리 보장 필드 기입
            stnIds: '108',     // 서울 관측소 고유 번호
            pageNo: '1',
            numOfRows: '10'
          }
        });

        console.log("ASOS 수신 결과 데이터:", response.data);

        // 포털 점검이나 동기화 거부 시 문자열 에러 대응
        if (typeof response.data === 'string' && response.data.includes('<returnAuthMsg>')) {
          setError('공공데이터포털 인증키가 아직 활성화 대기 중입니다. (최대 1시간 소요)');
          return;
        }

        const infoList = response.data?.response?.body?.items?.item;

        if (infoList && infoList.length > 0) {
          const currentObs = infoList[0]; 
          setWeatherData({
            temperature: currentObs.ta || '0',   
            humidity: currentObs.hm || '0',      
            windSpeed: currentObs.ws || '0',     
            precipitation: (currentObs.rn === '' || currentObs.rn === '0.0') ? '0' : currentObs.rn
          });
        } else {
          // 정상 응답은 왔으나 해당 시간대에 아직 집계가 안 끝났을 때 알림
          const resultMsg = response.data?.response?.header?.resultMsg;
          setError(`기상청 응답: ${resultMsg || '데이터 미준비 (시간대 조정 필요)'}`);
        }
      } catch (err) {
        console.error("세부 에러로그:", err);
        setError('서버 통신 실패 (403 Forbidden / 프록시 점검 필요)');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div style={styles.message}>실시간 지상 종관 데이터를 불러오는 중...</div>;
  if (error) return <div style={{ ...styles.message, ...styles.error }}>{error}</div>;

  const isRainy = parseFloat(weatherData.precipitation) > 0;
  const skyText = isRainy ? '비 오는 중' : (parseFloat(weatherData.humidity) > 75 ? '흐림/습함' : '맑음/쾌적');

  return (
    <div style={styles.container}>
      <div style={{ ...styles.statusCard, backgroundColor: isRainy ? '#5c7cfa' : '#4a90e2' }}>
        <div style={styles.overlay}>
          <h1 style={styles.statusTitle}>{skyText}</h1>
          <p style={styles.statusSub}>SEOUL ASOS REALTIME</p>
        </div>
      </div>

      <h2 style={styles.title}>서울 지상 종관 관측 정보</h2>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <span style={styles.label}>현재 기온</span>
          <span style={styles.value}>{weatherData.temperature}°C</span>
        </div>
        <div style={styles.card}>
          <span style={styles.label}>상대 습도</span>
          <span style={styles.value}>{weatherData.humidity}%</span>
        </div>
        <div style={styles.card}>
          <span style={styles.label}>풍속</span>
          <span style={styles.value}>{weatherData.windSpeed} m/s</span>
        </div>
        <div style={styles.card}>
          <span style={styles.label}>시간당 강수량</span>
          <span style={styles.value}>{weatherData.precipitation} mm</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px 20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'sans-serif' },
  statusCard: { height: '200px', borderRadius: '16px', marginBottom: '25px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' },
  statusTitle: { margin: '0', fontSize: '32px', fontWeight: 'bold', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' },
  statusSub: { margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9, letterSpacing: '1px' },
  title: { fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333', textAlign: 'left' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' },
  card: { padding: '20px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: '500' },
  value: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a' },
  message: { textAlign: 'center', marginTop: '100px', fontSize: '16px', color: '#64748b' },
  error: { color: '#ef4444', fontWeight: 'bold' }
};

export default Main;