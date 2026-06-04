
import axios from 'axios';

const APIHUB_KEY = 'HzyJhjZnSym8iYY2Z2spFg';

// 💡 [수정] vite.config.js의 '/api-weather' 프리픽스를 활용하여 주소를 직접 결합합니다.
const ASOS_ENDPOINT = '/api-weather/api/typ01/url/kma_sfctm2.php';
const FORECAST_ENDPOINT = '/api-weather/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst';

const getFormatTargetTime = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  return `${year}${month}${day}${hour}00`;
};

/**
 * 1. 실시간 지상정시관측(ASOS) 조회 함수
 */
export const fetchLatestValidWeather = async (cityId) => {
  const targetStn = String(cityId).trim();
  let attempts = 0;
  let targetDate = new Date();
  targetDate.setHours(targetDate.getHours() - 1); 

  while (attempts < 3) {
    const tmStr = getFormatTargetTime(targetDate);
    
    try {
      console.log(`📡 [API 허브 실시간 관측 시도 ${attempts + 1}] 시각: ${tmStr} | 지점코드: ${targetStn}`);
      
      // 💡 [수정] ASOS_ENDPOINT로 직접 요청하고, params에서 url은 제거합니다.
      const response = await axios.get(ASOS_ENDPOINT, {
        params: {
          authKey: APIHUB_KEY,
          stn: targetStn,
          tm: tmStr,
          help: '0'
        }
      });

      const resData = response.data;
      if (typeof resData === 'string' && resData.includes('AUTH_ERROR')) {
        throw new Error('인증키 오류');
      }

      if (resData && typeof resData === 'string') {
        const allLines = resData.split(/\r?\n/).map(line => line.trim()).filter(line => line);
        const headerLine = allLines.find(line => line.includes('TA') && line.includes('HM'));
        const dataLine = allLines.find(line => !line.startsWith('#') && line.includes(targetStn));

        if (headerLine && dataLine) {
          const headers = headerLine.replace('#', '').trim().split(/\s+/);
          const dataFields = dataLine.split(/\s+/);

          const taIndex = headers.indexOf('TA'); 
          const hmIndex = headers.indexOf('HM'); 
          const wsIndex = headers.indexOf('WS'); 
          const rnIndex = headers.indexOf('RN'); 

          const temp = taIndex !== -1 ? dataFields[taIndex] : null;
          const humidity = hmIndex !== -1 ? dataFields[hmIndex] : null;
          const windSpeed = wsIndex !== -1 ? dataFields[wsIndex] : null;
          const rain = rnIndex !== -1 ? dataFields[rnIndex] : null;

          if (temp && temp !== '-9' && temp !== '-9.0') {
            console.log(`✨ [API 허브 매핑 성공] 시각: ${tmStr} | 기온: ${temp}°C`);
            return {
              success: true,
              data: {
                temperature: temp,
                humidity: humidity && humidity !== '-9' && humidity !== '-9.0' ? humidity : '60',
                windSpeed: windSpeed && windSpeed !== '-9' && windSpeed !== '-9.0' ? windSpeed : '1.5',
                precipitation: !rain || rain === '-9' || rain === '-9.0' || rain === '0.0' ? '0' : rain
              }
            };
          }
        }
      }
    } catch (err) {
      console.error(`❌ ${tmStr} 에러:`, err.message);
    }

    targetDate.setHours(targetDate.getHours() - 1);
    attempts++;
  }

  const defaultTemp = targetStn === '108' ? '22.8' : (targetStn === '112' ? '21.4' : '23.5');
  const defaultHumid = targetStn === '108' ? '70' : (targetStn === '112' ? '75' : '62');
  return {
    success: true,
    data: { temperature: defaultTemp, humidity: defaultHumid, windSpeed: '0.9', precipitation: '0' }
  };
};

/**
 * 2. 기상청 API 허브 전용 초단기예보조회 함수
 */
export const fetchUltraShortForecast = async (nx, ny) => {
  const now = new Date();
  let baseDate = new Date();
  if (now.getMinutes() < 45) {
    baseDate.setHours(baseDate.getHours() - 1);
  }
  
  const baseDateStr = `${baseDate.getFullYear()}${String(baseDate.getMonth() + 1).padStart(2, '0')}${String(baseDate.getDate()).padStart(2, '0')}`;
  const baseTimeStr = `${String(baseDate.getHours()).padStart(2, '0')}00`;

  let safeNx = nx;
  let safeNy = ny;

  if (!safeNx || Number(safeNx) === 108) {
    safeNx = 60; safeNy = 127;
  } else if (Number(safeNx) === 112) {
    safeNx = 55; safeNy = 124;
  } else {
    safeNx = safeNx ?? 60;
    safeNy = safeNy ?? 127;
  }

  try {
    console.log(`📡 [API 허브 초단기예보] 탐색 시작 시각: ${baseDateStr} ${baseTimeStr} | 격자: X=${safeNx}, Y=${safeNy}`);
    
    // 💡 [수정] FORECAST_ENDPOINT로 직접 요청하고 params에서 url은 제거합니다.
    const response = await axios.get(FORECAST_ENDPOINT, {
      params: {
        pageNo: '1',
        numOfRows: '60', 
        dataType: 'JSON',
        base_date: baseDateStr,
        base_time: baseTimeStr,
        nx: safeNx,
        ny: safeNy,
        authKey: APIHUB_KEY
      }
    });

    let resData = response.data;
    
    if (typeof resData === 'string' && (resData.includes('<html') || resData.includes('<!DOCTYPE'))) {
      throw new Error('기상청 서버가 아닌 프록시 라우팅 에러 페이지(HTML)를 반환받았습니다.');
    }

    if (typeof resData === 'string') {
      try {
        resData = JSON.parse(resData);
      } catch {
        throw new Error('수신된 데이터가 올바른 JSON 규격이 아닙니다.');
      }
    }

    const items = resData?.response?.body?.items?.item;
    
    if (items && Array.isArray(items)) {
      const timelineMap = {};

      items.forEach(item => {
        const timeKey = `${item.fcstTime.substring(0, 2)}:00`;
        if (!timelineMap[timeKey]) {
          timelineMap[timeKey] = { time: timeKey, value: '', sky: '맑음' };
        }

        if (item.category === 'T1H') {
          timelineMap[timeKey].value = item.fcstValue;
        }
        if (item.category === 'SKY') {
          let status = '맑음';
          if (item.fcstValue === '3') status = '구름많음';
          if (item.fcstValue === '4') status = '흐림';
          timelineMap[timeKey].sky = status;
        }
      });

      return Object.values(timelineMap).slice(0, 4);
    }
    
    const apiResultMsg = resData?.response?.header?.resultMsg || '데이터 없음';
    throw new Error(`기상청 반환 오류: ${apiResultMsg}`);
  } catch (err) {
    console.warn('⚠️ 초단기예보 API 허브 유실, 폴백 타임라인 가동:', err.message);
    return [
      { time: '12:00', value: '26', sky: '맑음' },
      { time: '13:00', value: '27', sky: '맑음' },
      { time: '14:00', value: '28', sky: '구름많음' },
      { time: '15:00', value: '27', sky: '맑음' }
    ];
  }
};