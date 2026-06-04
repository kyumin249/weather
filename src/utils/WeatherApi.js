import axios from 'axios';

// 오늘 날짜(YYYYMMDD)와 시간(HH00)을 생성하는 함수
const getKmaDateTime = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  
  let hour = now.getHours();
  // 기상청은 매시간 45분에 예보가 갱신됩니다. 45분 이전이면 1시간 전 예보를 사용합니다.
  if (now.getMinutes() < 45) hour -= 1;
  if (hour < 0) hour = 23;
  
  return {
    date: `${y}${m}${d}`,
    time: `${String(hour).padStart(2, '0')}00`
  };
};

export const fetchUltraShortForecast = async (nx = 55, ny = 127) => {
  const { date, time } = getKmaDateTime();
  
  try {
    // 중요한 점: 여기서는 URL 전체가 아니라, 기본 경로만 설정합니다.
    // 파라미터는 params 객체에 따로 담아야 날짜가 정상적으로 바뀝니다.
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst',
        pageNo: '1',
        numOfRows: '1000',
        dataType: 'JSON',
        base_date: date, // 20260604으로 자동 적용됨
        base_time: time,
        nx: nx,
        ny: ny
      }
    });

    const items = response?.data?.response?.body?.items?.item || [];
    
    // 데이터 가공
    const temperatures = items.filter(i => i.category === 'T1H').slice(0, 6);
    const sky = items.filter(i => i.category === 'SKY').slice(0, 6);

    return { success: true, temperatures, sky };
  } catch (err) {
    console.error('API 호출 실패:', err);
    return { success: false, temperatures: [], sky: [] };
  }
};