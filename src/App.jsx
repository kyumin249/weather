import { useState } from 'react';
import Header from './components/Layout/header';
import Main from './components/Layout/main';

function App() {
  // 'weather' (Home), 'cities' (frequently-city), 'week' (week-weather) 화면 제어
  const [view, setView] = useState('weather');

  return (
    <div>
      {/* Header에 현재 view 상태와 상태를 바꿀 함수를 넘겨줍니다 */}
      <Header currentView={view} onViewChange={setView} />
      {/* Main도 상위의 view 상태를 바라보게 합니다 */}
      <Main view={view} onViewChange={setView} />
    </div>
  );
}

export default App;
