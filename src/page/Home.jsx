import Header from '../components/Layout/header'; // 컴포넌트 경로에 맞게 수정해주세요
import Main from '../components/Layout/main';

const Home = () => {
  return (
    <div>
      {/* 대문자로 시작하는 커스텀 컴포넌트 매핑 */}
      <Header />
      <Main view="weather" /> 
    </div>
  ); // 괄호와 세미콜론으로 안전하게 마감
};

export default Home;