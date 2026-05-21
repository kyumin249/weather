import Header from './header';
function Nav() {
  return (
    <Header>
		<nav>
      		<ul className="nav-list">
        		<li className="nav-item">Home</li>
        		<li className="nav-item">frequently-site</li>
        		<li className="nav-item">week-weather</li>
      		</ul>
    	</nav>
	</Header>
  );
}

export default Nav;
