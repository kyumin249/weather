import { useState, useEffect } from 'react';

const Week = ({ currentCity, onViewChange }) => {
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 요일 계산을 위한 유틸리티
  const getDayName = (offset) => {
    if (offset === 0) return '오늘';
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date);
  };

  useEffect(() => {
    // 🚀 향후 기상청 API 허브(getMidLandFcst, getMidTa) 연동을 위한 자리입니다.
    // 현재는 UI 디자인을 확인하기 위해 7일 치 목업(Mock) 데이터를 동적으로 생성합니다.
    const fetchWeeklyData = async () => {
      setLoading(true);
      try {
        // API 호출을 시뮬레이션 (0.5초 대기)
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockForecast = Array.from({ length: 7 }).map((_, index) => {
          // 가상의 기온 패턴 생성 (점점 더워지는 패턴 등)
          const baseMin = 18 + Math.floor(Math.random() * 3);
          const baseMax = baseMin + 8 + Math.floor(Math.random() * 4);
          const skies = ['☀️', '🌤️', '☁️', '🌧️'];
          
          return {
            id: index,
            day: getDayName(index),
            sky: skies[Math.floor(Math.random() * skies.length)],
            minTemp: baseMin,
            maxTemp: baseMax,
          };
        });

        setWeekData(mockForecast);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [currentCity]);

  return (
    <div style={styles.container}>
      {/* 상단 헤더 영역 */}
      <div style={styles.header}>
        <button onClick={() => onViewChange('weather')} style={styles.backButton}>
          ← 뒤로
        </button>
        <h1 style={styles.pageTitle}>{currentCity.name} 주간 예보</h1>
      </div>
      
      <p style={styles.subTitle}>향후 7일간의 기상 트렌드입니다.</p>

      {/* 7일 주간 예보 리스트 영역 */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.loadingText}>주간 예보 데이터를 불러오는 중...</div>
        ) : (
          weekData.map((item, index) => (
            <div key={item.id} style={{
              ...styles.row,
              borderBottom: index === weekData.length - 1 ? 'none' : '1px solid #f1f5f9'
            }}>
              {/* 요일 */}
              <span style={{ ...styles.dayText, fontWeight: index === 0 ? 'bold' : 'normal' }}>
                {item.day}
              </span>
              
              {/* 날씨 아이콘 */}
              <span style={styles.skyIcon}>{item.sky}</span>
              
              {/* 온도 게이지 바 영역 */}
              <div style={styles.tempContainer}>
                <span style={styles.minTemp}>{item.minTemp}°</span>
                
                <div style={styles.barBackground}>
                  {/* 최저/최고 기온에 따라 바의 위치와 길이를 유동적으로 조정하는 인라인 스타일 */}
                  <div style={{
                    ...styles.barFill,
                    left: `${(item.minTemp - 15) * 4}%`, // 15도를 0% 기준으로 삼은 가상 비율
                    width: `${(item.maxTemp - item.minTemp) * 4}%`,
                    background: item.maxTemp > 28 
                      ? 'linear-gradient(90deg, #60a5fa, #f87171)' // 더우면 빨간색 그라데이션
                      : 'linear-gradient(90deg, #60a5fa, #34d399)' // 쾌적하면 초록색 그라데이션
                  }}></div>
                </div>

                <span style={styles.maxTemp}>{item.maxTemp}°</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// CSS-in-JS 스타일 객체
const styles = {
  container: { padding: '20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  backButton: { 
    background: 'none', border: 'none', fontSize: '15px', color: '#4a90e2', 
    cursor: 'pointer', padding: '0', fontWeight: 'bold' 
  },
  pageTitle: { fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#0f172a' },
  subTitle: { fontSize: '13px', color: '#64748b', marginBottom: '25px', lineHeight: '1.4' },
  card: { 
    backgroundColor: '#fff', borderRadius: '16px', padding: '10px 20px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' 
  },
  row: { 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
    padding: '16px 0', transition: 'background 0.2s ease' 
  },
  dayText: { flex: '1', fontSize: '16px', color: '#334155' },
  skyIcon: { flex: '1', fontSize: '20px', textAlign: 'center' },
  tempContainer: { 
    flex: '2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' 
  },
  minTemp: { fontSize: '15px', color: '#64748b', width: '25px', textAlign: 'right' },
  maxTemp: { fontSize: '15px', color: '#0f172a', fontWeight: '600', width: '25px', textAlign: 'left' },
  barBackground: { 
    position: 'relative', width: '80px', height: '6px', 
    backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' 
  },
  barFill: { 
    position: 'absolute', height: '100%', borderRadius: '4px' 
  },
  loadingText: { textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '14px' }
};

export default Week;