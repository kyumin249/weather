import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Layout/header';
import Main from './components/Layout/main'; // 💡 레이아웃 컴포넌트
import Home from './page/Home';             // 💡 실시간 대시보드 본체
import Cities from './page/CityPage';       // 💡 자주 보는 도시 페이지
import Week from './page/week';             // 💡 주간 날씨 페이지
import { FAVORITE_CITIES } from './content/cities';

function App() {
  // 💡 전역에서 공유할 선택된 도시 상태를 App 레벨로 끌어올립니다.
  const [currentCity, setCurrentCity] = useState(FAVORITE_CITIES[0]);

  return (
    <BrowserRouter>
      <Header />
      {/* Main은 순수 레이아웃(children을 감싸는 컨테이너) 역할만 수행합니다 */}
      <Main>
        <Routes>
          {/* 각 페이지 컴포넌트에 도시 상태와 변경 함수를 바인딩합니다 */}
          <Route 
            path="/" 
            element={<Home currentCity={currentCity} />} 
          />
          <Route 
            path="/cities" 
            element={<Cities currentCity={currentCity} setCurrentCity={setCurrentCity} />} 
          />
          <Route 
            path="/week" 
            element={<Week currentCity={currentCity} />} 
          />
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;
