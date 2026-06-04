import axios from 'axios';

// 1. ASOS 호출 수정
export const fetchLatestValidWeather = async (cityId) => {
  try {
    const response = await axios.get('/api/weather', {
      params: { 
        url: 'api/typ01/url/kma_sfctm2.php', // 실제 API 경로
        stn: String(cityId).trim(), 
        tm: '202606041300', 
        help: '0' 
      }
    });
    return { success: true, data: response.data };
  } catch (err) {
    console.error('ASOS 호출 실패:', err.message);
    return { success: false };
  }
};

// 2. 예보 호출 수정
export const fetchUltraShortForecast = async (nx, ny) => {
  try {
    const response = await axios.get('/api/weather', {
      params: {
        url: 'api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst',
        pageNo: '1',
        numOfRows: '1000',
        dataType: 'JSON',
        base_date: '20260604',
        base_time: '1300',
        nx: nx,
        ny: ny
      }
    });
    return response.data;
  } catch (err) {
    console.error('예보 호출 실패:', err.message);
    return null;
  }
};