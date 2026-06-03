

const FAVORITE_CITIES = [
  { name: '서울 특별시', id: '108', region: '수도권' },
  { name: '인천 광역시', id: '112', region: '수도권' },
  { name: '대전 광역시', id: '133', region: '충청도' },
  { name: '대구 광역시', id: '143', region: '경상도' },
  { name: '광주 광역시', id: '156', region: '전라도' },
  { name: '부산 광역시', id: '159', region: '경상도' },
  { name: '제주 특별자치도', id: '184', region: '제주' }
];

const CityPage = ({ onSelectCity, onBack }) => {
  return (
    <div style={styles.container}>
      {/* 상단 헤더 영역 */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>←</button>
        <h1 style={styles.headerTitle}>자주 보는 도시 설정</h1>
      </div>

      <p style={styles.subTitle}>날씨를 확인할 지역을 선택해 주세요.</p>

      {/* 도시 리스트 영역 */}
      <div style={styles.list}>
        {FAVORITE_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)} // 클릭 시 부모에게 전달 후 이동
            style={styles.cityCard}
          >
            <div style={styles.cityInfo}>
              <span style={styles.cityName}>{city.name}</span>
              <span style={styles.regionTag}>{city.region}</span>
            </div>
            <span style={styles.arrow}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  backButton: { fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px 0 0', color: '#333' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1e293b' },
  subTitle: { fontSize: '14px', color: '#64748b', marginBottom: '25px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  cityCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.2s' },
  cityInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  cityName: { fontSize: '16px', fontWeight: '600', color: '#0f172a' },
  regionTag: { fontSize: '12px', color: '#94a3b8' },
  arrow: { fontSize: '22px', color: '#cbd5e1' }
};

export default CityPage;