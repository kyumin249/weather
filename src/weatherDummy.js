// src/weatherDummy.js

// 1. 현재 날씨용 더미 데이터 (Current Weather)
export const dummyCurrentWeather = {
  name: "Seoul",
  coord: { lat: 37.5665, lon: 126.978 },
  weather: [
    {
      main: "Clear",
      description: "맑음",
      icon: "01d" // OpenWeatherMap의 맑은 날 아이콘 코드
    }
  ],
  main: {
    temp: 26.5,       /* 현재 기온 (섭씨) */
    feels_like: 22.8, /* 체감 온도 */
    temp_min: 20.0,   /* 최저 기온 */
    temp_max: 26.0,   /* 최고 기온 */
    humidity: 65,     /* 습도 (%) */
    pressure: 1012    /* 기압 */
  },
  wind: {
    speed: 2.5        /* 풍속 (m/s) */
  }
};

// 2. 5일 예보용 더미 데이터 (5 Days Forecast)
// 원래 API는 3시간 단위로 40개를 주지만, 화면 구현용으로 정오(12:00) 기준 5개만 솎아낸 형태입니다.
export const dummyForecast = [
  {
    dt_txt: "2026-05-22 12:00:00",
    day: "금요일",
    main: { temp: 24.0, humidity: 50 },
    weather: [{ main: "Clear", icon: "01d", description: "맑음" }]
  },
  {
    dt_txt: "2026-05-23 12:00:00",
    day: "토요일",
    main: { temp: 21.5, humidity: 75 },
    weather: [{ main: "Rain", icon: "10d", description: "비" }]
  },
  {
    dt_txt: "2026-05-24 12:00:00",
    day: "일요일",
    main: { temp: 22.0, humidity: 60 },
    weather: [{ main: "Clouds", icon: "03d", description: "구름 많음" }]
  },
  {
    dt_txt: "2026-05-25 12:00:00",
    day: "월요일",
    main: { temp: 25.5, humidity: 40 },
    weather: [{ main: "Clear", icon: "01d", description: "맑음" }]
  },
  {
    dt_txt: "2026-05-26 12:00:00",
    day: "화요일",
    main: { temp: 23.0, humidity: 55 },
    weather: [{ main: "Clouds", icon: "02d", description: "구름 조금" }]
  }
];

// 3. 즐겨찾기 목록용 더미 데이터 (사이드바 테스트용)
export const dummyFavorites = [
  { id: 1, name: "Seoul", temp: 23.5 },
  { id: 2, name: "Tokyo", temp: 19.2 },
  { id: 3, name: "New York", temp: 14.8 }
];

export const standard = [
    dummyForecast.find(item => item.day === "금요일"),
    dummyForecast.find(item => item.day === "토요일"),
    dummyForecast.find(item => item.day === "일요일"),
    dummyForecast.find(item => item.day === "월요일"),
    dummyForecast.find(item => item.day === "화요일")
];
/*
@param {number} temp
@param {number} humidity 
*/
export function getWeatherStateByValue(temp, humidity) {
  if (temp <= 0) {
    return { status: "Snow", desc: "눈 / 한파", imgSrc: "assets/snow.jpg" }; // 눈
  }
  if (humidity >= 85) {
    return { status: "Drizzle", desc: "흐림 (다습)", imgSrc: "/assets/overcast.jpg" }; // 흐린
  } else if (humidity >= 55) {
    return { status: "Clouds", desc: "구름많음", imgSrc: "/assets/mostlyCloudy.jpg" }; // 구름많음
  } else {
    return { status: "Clear", desc: "맑음 (쾌적)", imgSrc: "/assets/sunny.jpg" }; // 맑음
  }
}