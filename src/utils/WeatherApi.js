import axios from 'axios';
export const fetchLatestValidWeather = async (cityId) => {
  try {
    const response = await axios.get('/api/weather', {
      params: { url: 'api/typ01/url/kma_sfctm2.php', stn: String(cityId).trim(), tm: '202606041300', help: '0' }
    });

    // 1단계: 서버 응답 확인
    console.log("서버에서 받은 원본 데이터:", response.data); 

    const lines = response.data.split('\n');
    const dataLine = lines.find(line => line.trim() && !line.startsWith('#'));
    
    // 2단계: 파싱할 줄이 있는지 확인
    console.log("데이터 추출 라인:", dataLine);

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
    console.error('API 통신 에러 발생:', err); // 3단계: 통신 에러 확인
    return { success: false, data: null };
  }
};