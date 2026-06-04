import axios from 'axios';

const getBaseDate = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');
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
      params: { url: 'api/typ01/url/kma_sfctm2.php', stn: String(cityId).trim(), tm: `${getBaseDate()}${getBaseTime()}`, help: '0' }
    });
    const lines = response.data.split('\n');
    const dataLine = lines.find(line => line.trim() && !line.startsWith('#'));
    if (dataLine) {
      const parts = dataLine.trim().split(/\s+/);
      return { success: true, data: { temperature: parts[11], humidity: parts[13], windSpeed: parts[3], precipitation: parts[15] } };
    }
    return { success: false, data: null };
  } catch  { return { success: false, data: null }; }
};

export const fetchUltraShortForecast = async (nx = 60, ny = 123) => { // 안양 좌표로 권장 조정
  try {
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst',
        pageNo: '1', numOfRows: '1000', dataType: 'JSON',
        base_date: getBaseDate(), base_time: getBaseTime(), nx, ny
      }
    });
    const items = response?.data?.response?.body?.items?.item || [];
    return { 
      success: true, 
      temperatures: items.filter(i => i.category === 'T1H')
    };
  } catch  { return { success: false, temperatures: [] }; }
};

export const fetchLandForecast = async (regId = '11A00101') => {
  try {
    const response = await axios.get('/api/weather', {
      params: { url: 'api/typ02/openApi/VilageFcstMsgService/getLandFcst', pageNo: '1', numOfRows: '10', dataType: 'JSON', regId }
    });
    return { success: true, data: response.data?.response?.body?.items?.item || [] };
  } catch  { return { success: false, data: [] }; }
};