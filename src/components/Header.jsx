import React from 'react';
import logo from '../assets/logo.jpg';

const Header = () => (
	<header>
		<div className="logo">
			<figure>
				<img width="200" height="100" src={logo} alt=""/>
			</figure>
			<h1>Dicionario Wapichana</h1>
		</div>
	</header>
);

export default Header;