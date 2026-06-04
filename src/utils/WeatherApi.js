
import axios from 'axios';

// 공통 날짜 생성 (초단기 예보용)
const getBaseDate = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');
const getBaseTime = () => {
  const now = new Date();
  let hour = now.getHours();
  if (now.getMinutes() < 45) hour -= 1;
  if (hour < 0) hour = 23;
  return `${String(hour).padStart(2, '0')}00`;
};

// [API 1] 초단기 예보 조회 (getUltraSrtFcst) - 날짜/시간 필수
export const fetchUltraShortForecast = async (nx = 55, ny = 127) => {
  try {
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst',
        pageNo: '1',
        numOfRows: '1000',
        dataType: 'JSON',
        base_date: getBaseDate(), // 오늘 날짜 적용
        base_time: getBaseTime(),
        nx,
        ny
      }
    });

    const items = response?.data?.response?.body?.items?.item || [];
    return { 
      success: true, 
      temperatures: items.filter(i => i.category === 'T1H').slice(0, 4),
      sky: items.filter(i => i.category === 'SKY').slice(0, 4)
    };
  } catch (err) {
    console.error('초단기 예보 호출 실패:', err);
    return { success: false, temperatures: [], sky: [] };
  }
};

// [API 2] 육상예보 조회 (getLandFcst) - 지역코드 기반
export const fetchLandForecast = async (regId = '11A00101') => {
  try {
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstMsgService/getLandFcst',
        pageNo: '1',
        numOfRows: '10',
        dataType: 'JSON',
        regId: regId // 지역별 상세 예보 코드
      }
    });
    
    // 데이터 가공 (통보문 데이터)
    const items = response?.data?.response?.body?.items?.item || [];
    return { success: true, data: items };
  } catch (err) {
    console.error('육상예보 호출 실패:', err);
    return { success: false, data: null };
  }
};