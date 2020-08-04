import React, { useState } from 'react';
import Button from './button/';
import { binaryFor, decimalFor, octalFor, hexadecimalFor } from './helper/conversion';

import './styles.css';

export default function App() {
	const [base1, setBase1] = useState(parseInt(localStorage.getItem('base1')) || 10);
	const [base2, setBase2] = useState(parseInt(localStorage.getItem('base2')) || 2);
	const [base1Value, setBase1Value] = useState('');
	const [base2Value, setBase2Value] = useState('');
	
	}
	
	function selectBase1(base) {
		try {
			localStorage.setItem('base1', base)
		}catch(e) {
			alert(e.message)
		}finally{
			setBase1(base)
		}
	}
	
	function selectBase2(base) {
		try {
			localStorage.setItem('base2', base)
		}catch(e) {
			alert(e.message)
		}finally{
			setBase2(base)
		}
	}
	
	function convert() {
		let res;
		
		if ((!base1Value || !base1Value.length) && (!base2Value || base2Value.length)) {
			return
		}
		
		const base = base1Value ? base1 : base2;
		const forBase = base1Value ? base2 : base1;
		const number = base1Value ?? base2Value;
		
		switch (base) {
			case 8:
				res = octalFor(forBase, number);
				break;
				
			case 10:
				res = decimalFor(forBase, number);
				break;
			
			case 16:
				res = hexadecimalFor(forBase, number);
				break;
			
			//2
			default:
				res = binaryFor(forBase, number);
				break;
		}
		
		if (base1Value && base1Value.length) {
			return setBase2Value(res)
		}
		
		setBase1Value(res)

	}
	
	return (
		<>
			<header>
				<h1>Numeric Base Converter</h1>
			</header>
			
			<main className='container'>
				<input id='base1' 
					onChange={e => setBase1Value(e.target.value)} 
					value={base1Value}
					tabIndex='1'
					className={base1}
				/>
				
				<Button style={{ 
					backgroundColor: base1 === 2 ? 'var(--binaryColor)' : 'transparent',
					color: base1 === 2 ? 'white' : 'black'
				}} disabled={base2 === 2} onClick={() => selectBase1(2)} base='binary' />
				
				<Button style={{ 
					backgroundColor: base1 === 10 ? 'var(--decimalColor)' : 'transparent',
					color: base1 === 10 ? 'white' : 'black'
				}} disabled={base2 === 10} onClick={() => selectBase1(10)} base='decimal' />
			
				<Button style={{ 
					backgroundColor: base1 === 8 ? 'var(--octalColor)' : 'transparent',
					color: base1 === 8 ? 'white' : 'black'
				}} disabled={base2 === 8} onClick={() => selectBase1(8)} base='octal' />
				
				<Button style={{ 
					backgroundColor: base1 === 16 ? 'var(--hexColor)' : 'transparent',
					color: base1 === 16 ? 'white' : 'black'
				}} disabled={base2 === 16} onClick={() => selectBase1(16)} base='hexadecimal' />

				<input id='base2' 
					onChange={e => setBase2Value(e.target.value)} 
					value={base2Value}
					tabIndex='2'
					className={base2}
				/>
				
				<Button style={{ 
					backgroundColor: base2 === 2 ? 'var(--binaryColor)' : 'transparent',
					color: base2 === 2 ? 'white' : 'black'
				}} disabled={base1 === 2} onClick={() => selectBase2(2)} base='binary' />
				
				<Button style={{ 
					backgroundColor: base2 === 10 ? 'var(--decimalColor)' : 'transparent',
					color: base2 === 10 ? 'white' : 'black'
				}} disabled={base1 === 10} onClick={() => selectBase2(10)} base='decimal' />
			
				<Button style={{ 
					backgroundColor: base2 === 8 ? 'var(--octalColor)' : 'transparent',
					color: base2 === 8 ? 'white' : 'black'
				}} disabled={base1 === 8} onClick={() => selectBase2(8)} base='octal' />
				
				<Button style={{ 
					backgroundColor: base2 === 16 ? 'var(--hexColor)' : 'transparent',
					color: base2 === 16 ? 'white' : 'black'
				}} disabled={base1 === 16} onClick={() => selectBase2(16)} base='hexadecimal' />
				
				<button onClick={convert} id='convert'>Convert</button>
	
			</main>
			
			<footer>
				
			</footer>
		</>
	);
}