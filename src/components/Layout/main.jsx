import axios from 'axios';
import { useEffect, useState } from 'react';

// 자주 보는 도시 리스트 매핑 데이터
const FAVORITE_CITIES = [
  { name: '서울 특별시', id: '108', region: '수도권' },
  { name: '인천 광역시', id: '112', region: '수도권' },
  { name: '대전 광역시', id: '133', region: '충청도' },
  { name: '대구 광역시', id: '143', region: '경상도' },
  { name: '광주 광역시', id: '156', region: '전라도' },
  { name: '부산 광역시', id: '159', region: '경상도' },
  { name: '제주 특별자치도', id: '184', region: '제주' }
];

const Main = ({ view, onViewChange: setView }) => {
  // 현재 선택된 도시 관리 (기본값: 서울)
  const [currentCity, setCurrentCity] = useState(FAVORITE_CITIES[0]);
  
  // 실시간 기상 관측 데이터 상태 관리
  const [weatherData, setWeatherData] = useState({
    temperature: '--', humidity: '--', windSpeed: '--', precipitation: '--'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 기상청 ASOS 정시 관측 데이터 동기화 지연을 고려한 안전 시간 계산 함수
  const getObservTime = () => {
    const now = new Date();
    // 데이터 포털 내부 업로드 지연으로 인한 빈 값(NO_DATA) 오류를 방지하기 위해 
    // 기존 -2시간에서 한 시간 더 여유를 둔 -3시간 전 데이터를 안전하게 조회합니다.
    now.setHours(now.getHours() - 3); 
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

        // 🔍 트래블슈팅용 디버깅 로그: 브라우저 F12 콘솔 탭에서 기상청 원본 응답 구조 확인 가능
        console.log(`📡 [${currentCity.name}] API 원본 데이터 응답:`, response.data);

        const header = response.data?.response?.header;
        const resBody = response.data?.response?.body;

        // [개선된 에러 처리 1] 기상청 시스템 내부 에러 코드가 내려온 경우 (인증 실패, 트래픽 한도 초과 등)
        if (header && header.resultCode !== '00') {
          setError(`기상청 에러 [${header.resultCode}]: ${header.resultMsg}`);
          return;
        }

        // [개선된 에러 처리 2] 통신은 정상(00)이나 해당 지역/시간대의 관측 레코드가 완벽히 생성되지 않은 경우
        if (!resBody || !resBody.items || resBody.items === '') {
          setError(`[NO_DATA] 현재 시간대(${tm.date} ${tm.hour}시)의 ${currentCity.name} 관측 자료가 아직 기상청에 업데이트되지 않았습니다. 잠시 후 다시 시도해 주세요.`);
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
      } catch (err) {
        setError('네트워크 연결 또는 API 서버 요청 중에 실패했습니다.');
        console.error('API 통신 예외 발생:', err);
      } finally {
        setLoading(false);
      }
    };

    // 'weather' (Home 단일 보기) 화면이 활성화되어 있을 때만 기상청 트래픽 호출 허용
    if (view === 'weather') {
      fetchWeather();
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
                setView('weather'); // 대시보드로 돌아가며 새로운 도시 날씨 로드 트리거
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
  // 화면 2: [week-weather] 주간 날씨 예보 뷰 (임시 스케치)
  // ==========================================
  if (view === 'week') {
    return (
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>주간 날씨 예보</h1>
        <p style={styles.subTitle}>단기/중기 예보 데이터를 기반으로 한 7일간의 기상 정보 서비스 준비 중입니다.</p>
        <div style={{...styles.card, padding: '50px 20px', color: '#94a3b8'}}>
          📅 주간 예보 가로 스크롤 카드 레이아웃 영역
        </div>
      </div>
    );
  }

  // ==========================================
  // 화면 3: [Home] 실시간 기상 관측 대시보드 뷰
  // ==========================================
  if (loading) return <div style={styles.message}>기상청 실시간 관측 데이터 동기화 중...</div>;
  if (error) return <div style={{ ...styles.message, color: '#ef4444', lineHeight: '1.5' }}>{error}</div>;

  const isRainy = parseFloat(weatherData.precipitation) > 0;
  const skyText = isRainy ? '비 오는 중' : (parseFloat(weatherData.humidity) > 75 ? '흐림/습함' : '맑음/쾌적');

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