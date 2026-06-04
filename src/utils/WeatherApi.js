import axios from 'axios';

const APIHUB_KEY = 'HzyJhjZnSym8iYY2Z2spFg';

export const fetchLatestValidWeather = async (cityId) => {
  const targetStn = String(cityId).trim();
  const tmStr = '202606041300';

  try {
    const response = await axios.get('/api-weather/api/typ01/url/kma_sfctm2.php', {
      params: { authKey: APIHUB_KEY, stn: targetStn, tm: tmStr, help: '0' }
    });
    return { success: true, data: response.data };
  } catch (err) {
    console.error('ASOS 호출 실패:', err.message);
    return { success: false };
  }
};

export const fetchUltraShortForecast = async (nx, ny) => {
  try {
    const response = await axios.get('/api-weather/api/typ02/url/vfcst_ekspl02.php', {
      params: { authKey: APIHUB_KEY, tm: '202606041300', x: nx, y: ny, help: '0' }
    });
    return response.data;
  } catch (err) {
    console.error('예보 호출 실패:', err.message);
    return [];
  }
};