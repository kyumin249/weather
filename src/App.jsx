import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/header';
import Main from './components/Layout/main';
import Home from './pages/Home';
import Cities from './pages/Cities';
import Week from './pages/Week';

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
