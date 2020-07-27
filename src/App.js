import React, { useState } from 'react';
import Button from './button/';

import './styles.css';

export default function App() {
	const [base1, setBase1] = useState(parseInt(localStorage.getItem('base1')) || 10);
	const [base2, setBase2] = useState(parseInt(localStorage.getItem('base2')) || 2);
	const [base1Value, setBase1Value] = useState('');
	const [base2Value, setBase2Value] = useState('');
	
	const hexSymbols = {
		'A': 10,
		'B': 11,
		'C': 12,
		'D': 13,
		'E': 14,
		'F': 15
	}
	
	const hexNumbers = {
		10: 'A',
		11: 'B',
		12: 'C',
		13: 'D',
		14: 'E',
		15: 'F'
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
	
	function convertToBinary(numb) {
		let rests = [], quo = numb;

		do {
			rests.push(quo % 2)
			
			quo = parseInt(quo / 2)
			
			if (quo < 2 && quo > 0) {
				rests.push(quo)
			}
			
		} while(quo >= 2)
		
		return rests.reverse().join('');
	}
	
	function convertToDecimal(base, numb) {
		let res = 0;
		
		const numbs = numb.toString().split('').reverse();
			
		for (let i = 0; i < numbs.length; i++) {
			const n = hexSymbols[numbs[i]] ?? numbs[i];
			res = res + n * base ** i;
		}
		
		return res
	}
	
	function binaryFor(base, numb) {
		let res = 0;
		
		if (base === 10) {
			res = convertToDecimal(2, numb)
		}else {
			res = '';
			const numbs = [], digits = numb.split('');
			const arrayLen = digits.length, relacion = base === 16 ? 4 : 3;
			
			while(digits.length > 0) {
				numbs.unshift(digits.splice(-relacion))
			}
			
			//Array of arrays
			for (const numArray of numbs) {
				let result = 0
				
				numArray.reverse()

				for (let n = 0; n < numArray.length; n++) {
					result += numArray[n] * 2 ** n
				}
				
				res = (base === 16 && result > 9) ? res + hexNumbers[result] : res + result;
				result = 0
			}
		}
		
		return res
	}
	
	function decimalFor(base, numb) {
		let rests = [], quo = numb;

		do {
			const rest = (base === 16 && quo % base > 9) ? hexNumbers[quo % base] : quo % base;
			rests.push(rest)
			
			quo = parseInt(quo / base)
			
			if (quo < base && quo > 0) {
				rests.push(quo)
			}
			
		} while(quo >= base)
		
		return rests.reverse().join('');
	}
	
	function octalFor(base, numb) {
		let res = ''
		
		if (base === 10) {
			res = convertToDecimal(8, numb)
		}
		
		if (base === 2 || base === 16) {
			let numbs = numb.split('')
			numbs = numbs.map(n => convertToBinary(n).padStart(3, 0))
			
			//turns into a string and removes the leading zeros
			res = numbs.join('').replace(/^[0]*/, '')
		}
		
		if (base === 16) {
			res = binaryFor(16, res)
		}
		
		return res
	}
	
	function hexadecimalFor(base, numb) {
		let res;
		const numbs = numb.split('').map(n => hexSymbols[n] ?? n)

		if (base === 2 || base === 8) {
			const binaries = numbs.map(n => convertToBinary(n).padStart(4, 0))
			
			res = binaries.join('').replace(/^[0]*/, '')
		}
		
		if (base === 10) {
			res = convertToDecimal(16, numb)
		}
		
		if (base === 8) {
			res = binaryFor(8, res)
		}
		
		return res
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