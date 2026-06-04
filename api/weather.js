import axios from 'axios';

// process.env 대신 import.meta.env 사용
const APIHUB_KEY = import.meta.env.VITE_APIHUB_KEY;

export const fetchLatestValidWeather = async (cityId) => {
  try {
    const response = await axios.get('/api-weather', {
      params: {
        url: 'https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?authKey=HzyJhjZnSym8iYY2Z2spFg&stn=108&tm=202606041300&help=0',
        stn: cityId,
        tm: '202606041300',
        help: '0',
        authKey: APIHUB_KEY // 여기서 주입
      }
    });
    return { success: true, data: response.data };
  } catch (err) {
    console.error('호출 실패:', err.message);
    return { success: false };
  }
};