import axios from 'axios';

const APIHUB_KEY = 'HzyJhjZnSym8iYY2Z2spFg';
// 이제 직접 주소가 아닌 프록시 경로를 사용합니다.
const ASOS_ENDPOINT = '/api-weather/api/typ01/url/kma_sfctm2.php';

export const fetchLatestValidWeather = async (cityId) => {
  const targetStn = String(cityId).trim();
  const tmStr = '202606041300'; 

  try {
    const response = await axios.get(ASOS_ENDPOINT, {
      params: { 
        authKey: APIHUB_KEY, 
        stn: targetStn, 
        tm: tmStr, 
        help: '0' 
      }
    });

    console.log('데이터 성공:', response.data);
    return { success: true, data: response.data };
  } catch (err) {
    console.error('호출 실패:', err.message);
    return { success: false };
  }
};