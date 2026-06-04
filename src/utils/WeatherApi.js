import axios from 'axios';

const APIHUB_KEY = 'HzyJhjZnSym8iYY2Z2spFg';

// 프록시('/api-weather')를 통하지 않고 기상청 허브 주소를 직접 사용합니다.
const ASOS_ENDPOINT = 'https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php';

export const fetchLatestValidWeather = async (cityId) => {
  const targetStn = String(cityId).trim();
  const tmStr = '202606041300'; // 테스트를 위해 고정값 혹은 날짜 함수 사용

  try {
    // 직접 호출을 위해 headers 설정 (사용자 에이전트 추가)
    const response = await axios.get(ASOS_ENDPOINT, {
      params: { 
        authKey: APIHUB_KEY, 
        stn: targetStn, 
        tm: tmStr, 
        help: '0' 
      },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0' // 요청 주체를 브라우저인 것처럼 위장
      }
    });

    console.log('데이터 성공:', response.data);
    return { success: true, data: response.data };
  } catch (err) {
    console.error('호출 실패:', err.message);
    return { success: false };
  }
};