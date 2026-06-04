
import axios from 'axios';

// YYYYMMDD 날짜 생성
const getBaseDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

// HH00 시간 생성
const getBaseTime = () => {
  const now = new Date();
  let hour = now.getHours();
  if (now.getMinutes() < 45) hour -= 1;
  if (hour < 0) hour = 23;
  return `${String(hour).padStart(2, '0')}00`;
};

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
    console.error('ASOS 호출 실패:', err);
    return { success: false, data: null };
  }
};

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
        nx: nx,
        ny: ny
      }
    });

    const items = response?.data?.response?.body?.items?.item || [];

    const temperatures = items
      .filter(item => item.category === 'T1H')
      .slice(0, 4)
      .map(item => ({ time: item.fcstTime, value: item.fcstValue }));

    const sky = items
      .filter(item => item.category === 'SKY')
      .slice(0, 4)
      .map(item => ({ 
        time: item.fcstTime, 
        value: item.fcstValue === '1' ? '맑음' : item.fcstValue === '3' ? '구름많음' : '흐림' 
      }));

    return { success: true, temperatures, sky };
  } catch (err) {
    console.error('예보 호출 실패:', err);
    return { success: false, temperatures: [], sky: [] };
  }
};