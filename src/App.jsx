import Header from './components/Layout/header.jsx'
import Nav from './components/Layout/nav.jsx'
function App() {

  return (
    <>
	    <header className='w-full bg-white border-b border-slate-200 p-4'>
          <Header />
      </header>
      <aside className='w-full md:w-64 bg-white border-r border-slate-200 p-4'>
        <Nav />
      </aside>
      
    </>
  );
}

export default App
