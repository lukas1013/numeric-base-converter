import React from 'react';

import './styles.css';

export default function Button({ style, disabled, onClick, base }) {
	return (
		<button 
			onClick={onClick}
			disabled={disabled}
			style={style}
			className={base}>
			{base.replace(/^[bdho]/, base.charAt(0).toUpperCase())}
		</button>
	);
}