import React, { useReducer } from 'react';
import Button from './button/';
import { binaryFor, decimalFor, octalFor, hexadecimalFor } from './helper/conversion';

import './styles.css';

export default function App() {
	
	function reducer(state, action) {
		const newState = {...state}
		
		function getNextBase(previous) {
			let nextBase;
			
			if (previous === 10) {
				nextBase = 8
			}else if (previous === 8) {
				nextBase = 16
			}else if (previous === 16) {
				nextBase = 2
			}else {
				nextBase = 10
			}
			
			return nextBase
		}

		switch (action.type) {
			case 'set base1':
				newState.base1 = action.base1
				if (newState.base2 === newState.base1) {
					newState.base2 = getNextBase(newState.base2)
				}
				break;
			
			case 'set base1Value':
				newState.base1Value = action.value
				break;
				
			case 'set base2Value':
				newState.base2Value = action.value
				break;
			
			//case 'set base2':
			default:
				newState.base2 = action.base2
				if (newState.base1 === newState.base2) {
					newState.base1 = getNextBase(newState.base1)
				}
			
				break;
		}
		
		return newState
	}
	
	const [state, dispatch] = useReducer(reducer, {
		base1: localStorage.getItem('base1') || 10,
		base2: localStorage.getItem('base2') || 2,
		base1Value: null,
		base2Value: null
	});
	
	function selectBase1(base) {
		try {
			localStorage.setItem('base1', base)
		}catch(e) {
			alert(e.message)
		}finally{
			dispatch({
				type: 'set base1',
				base1: base
			})
		}
	}
	
	function selectBase2(base) {
		try {
			localStorage.setItem('base2', base)
		}catch(e) {
			alert(e.message)
		}finally{
			dispatch({
				type: 'set base2',
				base2: base
			})
		}
	}
	
	function convert() {
		let res;
		const convertBase1 = state.base1Value, convertBase2 = state.base2Value

		if (!convertBase1 && !convertBase2) {
			//throw Error
			return
		}
		
		const base = convertBase1 ? state.base1 : state.base2;
		const forBase = convertBase1 ? state.base2 : state.base1;
		const number = convertBase1 ? state.base1Value : state.base2Value;
		
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
		
		if (convertBase1) {
			return dispatch({
				type: 'set base2Value',
				value: res
			})
		}
		
		dispatch({
			type: 'set base1Value',
			value: res
		})

	}
	
	return (
		<>
			<header>
				<h1>Numeric Base Converter</h1>
			</header>
			
			<main className='container'>
				<input id='base1' 
					onChange={e => dispatch({
						type: 'set base1Value', 
						value: e.target.value
					})} 
					value={state.base1Value}
					tabIndex='1'
				/>
				
				<Button selected={state.base1 === 2} onClick={() => selectBase1(2)} base='binary' />
				
				<Button selected={state.base1 === 10} onClick={() => selectBase1(10)} base='decimal' />
			
				<Button selected={state.base1 === 8} onClick={() => selectBase1(8)} base='octal' />
				
				<Button selected={state.base1 === 16} onClick={() => selectBase1(16)} base='hexadecimal' />

				<input id='base2' 
					onChange={e => dispatch({
					type: 'set base2Value',
					value: e.target.value
					})} 
					value={state.base2Value}
					tabIndex='2'
				/>
				
				<Button selected={state.base2 === 2} onClick={() => selectBase2(2)} base='binary' />
				
				<Button selected={state.base2 === 10} onClick={() => selectBase2(10)} base='decimal' />
			
				<Button selected={state.base2 === 8} onClick={() => selectBase2(8)} base='octal' />
				
				<Button selected={state.base2 === 16} onClick={() => selectBase2(16)} base='hexadecimal' />
				
				<button onClick={convert} id='convert'>Convert</button>
	
			</main>
			
			<footer>
				
			</footer>
		</>
	);
}