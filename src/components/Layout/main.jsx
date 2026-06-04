

// 💡 라우터가 변경해주는 <Routes> 하위 컴포넌트들을 children으로 받아 렌더링만 해줍니다.
const Main = ({ children }) => {
  return (
    <main style={styles.mainContainer}>
      {children}
    </main>
  );
};

const styles = {
  mainContainer: {
    padding: '20px',
    maxWidth: '450px',
    margin: '0 auto',
    fontFamily: 'sans-serif'
  }
};

export default Main;