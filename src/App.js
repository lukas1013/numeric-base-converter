import React, { useReducer, useRef } from 'react';
import Button from './button/';
import { binaryFor, decimalFor, octalFor, hexadecimalFor } from './helper/conversion';

import './styles.css';

export default function App() {
	const base1Ref = useRef(null);
	const base2Ref = useRef(null);
	
	const basePatternAndTitle = {
		2: {
			pattern: '[01]+',
			title: 'only 0 and 1',
		},
		8: {
			pattern: '[0-7]+',
			title: 'only digits 0 to 7',
		},
		10: {
			pattern: '[0-9]+',
			title: 'only digits 0 to 9',
		},
		16: {
			pattern: '[0-9a-fA-F]+',
			title: 'only digits 0 to 9 and A to F'
		}
	}
	
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
		
		function setBase1(base, state) {
			state.base1 = base
			base1Ref.current.pattern = basePatternAndTitle[base].pattern
			base1Ref.current.checkValidity();
			state.base1Mismatch = base1Ref.current.validity.patternMismatch
		}
		
		function setBase2(base, state) {
			state.base2 = base
			base2Ref.current.pattern = basePatternAndTitle[base].pattern
			base2Ref.current.checkValidity();
			state.base2Mismatch = base2Ref.current.validity.patternMismatch
		}

		switch (action.type) {
			case 'set base1':
				setBase1(action.base1, newState)
				if (newState.base2 === newState.base1) {
					const base2 = getNextBase(newState.base2)
					setBase2(base2, newState)
				}
				break;
			
			case 'set base1Value':
				newState.base1Value = action.value
				break;
				
			case 'set base2Value':
				newState.base2Value = action.value
				break;
				
			case 'set base1 mismatch':
				newState.base1Mismatch = action.value
				break;
			
			case 'set base2 mismatch':
				newState.base2Mismatch = action.value
				break;
				
			//case 'set base2':
			default:
				setBase2(action.base2, newState)
				if (newState.base1 === newState.base2) {
					const base1 = getNextBase(newState.base1)
					setBase1(base1, newState)
				}
				break;
		}
		
		return newState
	}
	
	const [state, dispatch] = useReducer(reducer, {
		base1: 10,
		base2: 2,
		base1Value: null,
		base2Value: null,
		base1Mismatch: false,
		base2Mismatch: false
	});
	
	function selectBase1(base) {
		dispatch({
			type: 'set base1',
			base1: base
		});
	}
	
	function selectBase2(base) {
		dispatch({
			type: 'set base2',
			base2: base
		});
	}
	
	function convert() {
		const base1Mismatch = state.base1Mismatch
		const base2Mismatch = state.base2Mismatch
		const convertBase1 = (state.base1Value && state.base1Value.length), convertBase2 = (state.base2Value && state.base2Value.length && !(state.base1Value && state.base1Value.length))
		let res;
		
		if ((base1Mismatch && convertBase1) || (base2Mismatch && convertBase2)) {
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
					onChange={e => {
						e.target.checkValidity();
						e.target.reportValidity();
						
						if (!e.target.validity.patternMismatch) {
							dispatch({
								type: 'set base1 mismatch',
								value: false
							})
						}
						
						dispatch({
							type: 'set base1Value', 
							value: e.target.value
						})
					}}
					onInvalid={() => {
						dispatch({
							type: 'set base1 mismatch',
							value: true
						})
					}}
					value={state.base1Value}
					tabIndex='1'
					ref={base1Ref}
					pattern={basePatternAndTitle[state.base1].pattern}
					title={basePatternAndTitle[state.base1].title}
				/>
				
				{state.base1Mismatch && <span id='base1-mismatch'>Please enter, only valid digits</span>}
				
				<Button selected={state.base1 === 2} onClick={() => selectBase1(2)} base='binary' />
				
				<Button selected={state.base1 === 10} onClick={() => selectBase1(10)} base='decimal' />
			
				<Button selected={state.base1 === 8} onClick={() => selectBase1(8)} base='octal' />
				
				<Button selected={state.base1 === 16} onClick={() => selectBase1(16)} base='hexadecimal' />

				<input id='base2' 
					onChange={e => {
						e.target.checkValidity();
						e.target.reportValidity();
						
						if (!e.target.validity.patternMismatch) {
							dispatch({
								type: 'set base2 mismatch',
								value: false
							})
						}
						
						dispatch({
							type: 'set base2Value',
							value: e.target.value
						})
					}}
					onInvalid={() => {
						dispatch({
							type: 'set base2 mismatch',
							value: true
						})
					}}
					value={state.base2Value}
					tabIndex='2'
					ref={base2Ref}
					pattern={basePatternAndTitle[state.base2].pattern}
					title={basePatternAndTitle[state.base2].title}
				/>
				
				{state.base2Mismatch && !state.base1Value && <span id='base2-mismatch'>Please, enter only valid digits</span>}
				
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