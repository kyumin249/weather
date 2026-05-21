import Nav from './nav'; // Nav 컴포넌트 불러오기

function Header() {
  return (
    <div className="header-container">
      <div className="header-logo">🌤️ SkyCast</div>
      <Nav />
    </div>
  );
}

export default Header;
