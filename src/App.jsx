import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/header';
import Main from './components/Layout/main';
import Home from './page/Home';
import Cities from './page/Cities';
import Week from './page/week';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/week" element={<Week />} />
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;
