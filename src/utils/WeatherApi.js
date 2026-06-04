import axios from 'axios';

// --- 공통 유틸리티 (오늘 날짜 및 시간 자동 생성) ---
const getBaseDate = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');
const getBaseTime = () => {
  const now = new Date();
  let hour = now.getHours();
  if (now.getMinutes() < 45) hour -= 1;
  if (hour < 0) hour = 23;
  return `${String(hour).padStart(2, '0')}00`;
};

// --- [API 1] ASOS 실시간 관측 데이터 ---
export const fetchLatestValidWeather = async (cityId) => {
  try {
    const response = await axios.get('/api/weather', {
      params: { 
        url: 'api/typ01/url/kma_sfctm2.php', 
        stn: String(cityId).trim(), 
        tm: `${getBaseDate()}${getBaseTime()}`, 
        help: '0' 
      }
    });
    const lines = response.data.split('\n');
    const dataLine = lines.find(line => line.trim() && !line.startsWith('#'));
    if (dataLine) {
      const parts = dataLine.trim().split(/\s+/);
      return { 
        success: true, 
        data: { 
          temperature: parts[11], 
          humidity: parts[13], 
          windSpeed: parts[3], 
          precipitation: parts[15] 
        } 
      };
    }
    return { success: false, data: null };
  } catch (err) { 
    console.error('ASOS 조회 에러:', err);
    return { success: false, data: null }; 
  }
};

// --- [API 2] 초단기 예보 조회 (getUltraSrtFcst) ---
export const fetchUltraShortForecast = async (nx = 55, ny = 127) => {
  try {
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst',
        pageNo: '1', 
        numOfRows: '1000', 
        dataType: 'JSON',
        base_date: getBaseDate(), 
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
    console.error('초단기예보 조회 에러:', err);
    return { success: false, temperatures: [], sky: [] }; 
  }
};

// --- [API 3] 육상 예보 조회 (getLandFcst) ---
export const fetchLandForecast = async (regId = '11A00101') => {
  try {
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstMsgService/getLandFcst',
        pageNo: '1', 
        numOfRows: '10', 
        dataType: 'JSON', 
        regId 
      }
    });
    return { 
      success: true, 
      data: response.data.response.body.items.item 
    };
  } catch (err) { 
    console.error('육상예보 조회 에러:', err);
    return { success: false, data: null }; 
  }
};