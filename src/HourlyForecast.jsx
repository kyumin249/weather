

const HourlyForecast = ({ forecastData }) => {
  // 하늘 상태에 따른 아이콘/이모지 매핑 유틸
  const getWeatherIcon = (skyStatus) => {
    switch (skyStatus) {
      case '맑음':
        return '☀️';
      case '구름많음':
        return '⛅';
      case '흐림':
        return '☁️';
      default:
        return '✨';
    }
  };

  // 데이터가 없거나 로딩 중일 때 방어 처리
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="w-full py-6 text-center text-gray-400 bg-gray-800/40 rounded-2xl border border-gray-700/50">
        <p className="text-sm">예측 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-3xl p-5 border border-slate-800 shadow-xl">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="text-indigo-400">⏱️</span> 실시간 초단기 예보 (4시간)
        </h3>
        <span className="text-xs text-slate-500">1시간 단위 업데이트</span>
      </div>

      {/* 💡 가로 스크롤 타임라인 리스트 */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {forecastData.map((item, index) => (
          <div
            key={index}
            className="flex-1 min-w-[75px] bg-slate-800/50 hover:bg-slate-800/80 rounded-2xl p-3 flex flex-col items-center justify-between gap-2 border border-slate-700/30 transition-all duration-200 snap-center"
          >
            {/* 시간 */}
            <span className="text-xs font-medium text-slate-400">
              {item.time}
            </span>

            {/* 날씨 상태 아이콘/이모지 */}
            <span className="text-2xl my-0.5 filter drop-shadow-sm" title={item.sky}>
              {getWeatherIcon(item.sky)}
            </span>

            {/* 기온 정보 */}
            <div className="flex flex-col items-center">
              <span className="text-base font-bold text-slate-100 tracking-tight">
                {item.value}°
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {item.sky}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;