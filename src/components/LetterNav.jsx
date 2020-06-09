import React from 'react';

const LetterNav = ({ setLetter }) => {
	const letters = ['A', 'B', 'D', 'G', 'I', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'W', 'X', 'Y', 'Z', 'NH', 'CH'];
	return (
		<>
		<section className="search">
			<ul className="alfabeto">
				{letters.slice(0,letters.indexOf('S')).map(letter => (
					<li key={letter} onClick={() => setLetter(letter)}><a href="#">{letter}</a></li>
				))}
			</ul>
			<ul className="alfabeto">
				{letters.slice(letters.indexOf('S')).map(letter => (
					<li key={letter} onClick={() => setLetter(letter)}><a href="#">{letter}</a></li>
				))}
			</ul>
		</section>
		</>
	);
}

export default LetterNav;