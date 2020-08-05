import React from 'react';

import './styles.css';

export default function Button({ selected, onClick, base }) {
	const style = {
		backgroundColor: 'transparent',
		color: `var(--${base}Color)`,
		boxShadow: 'none',
		fontWeight: 'bold',
		textShadow: 'none'
	}
	
	return (
		<button 
			onClick={onClick}
			style={selected ? style : {}}
			className={base}>
			{base.replace(/^[bdho]/, base.charAt(0).toUpperCase())}
		</button>
	);
}