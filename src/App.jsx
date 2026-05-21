import Header from './components/Layout/header'
import Nav from './components/Layout/nav'
function App() {

  return (
    <div className='app-container'>
	    <header className='app-header'>
          <Header />
      </header>
      <div className='app-body'>
        <aside className='sidebar-layout'>
          <Nav />
        </aside>
        
      </div>
    </div>
  );
}

export default App
