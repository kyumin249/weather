import './header.css'

function Header() {
  return (
    <header>
		
	  	<ul>
			<li className="logo">
				<img src="/weather.svg" alt="Sun" />
				SkyCast
			</li>
        	<li className='urls'>Home</li>
        	<li className='urls'>frequently-city</li>
        	<li className='urls'>week-weather</li>
    	</ul>
    </header>
  );
}

export default Header;
