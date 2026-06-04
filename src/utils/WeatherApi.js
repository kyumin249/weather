import axios from 'axios';

// 공통 호출 함수
const weatherRequest = async (params) => {
  try {
    // 모든 요청을 /api/weather 로 통일
    const response = await axios.get('/api/weather', { params });
    return response.data;
  } catch (err) {
    console.error('API 호출 실패:', err);
    return null;
  }
};

export const fetchLatestValidWeather = async (cityId) => {
  const data = await weatherRequest({
    url: 'api/typ01/url/kma_sfctm2.php',
    stn: String(cityId).trim(),
    tm: '202606041300', // 예시 시간
    help: '0'
  });
  return { success: !!data, data };
};

export const fetchUltraShortForecast = async (nx, ny) => {
  return await weatherRequest({
    url: 'api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst',
    base_date: '20260604',
    base_time: '1300',
    nx, ny,
    dataType: 'JSON'
  });
};