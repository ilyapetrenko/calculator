import './index.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const calculatorABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'a', type: 'uint256' },
      { internalType: 'uint256', name: 'b', type: 'uint256' },
    ],
    name: 'add',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'a', type: 'uint256' },
      { internalType: 'uint256', name: 'b', type: 'uint256' },
    ],
    name: 'divide',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'a', type: 'uint256' },
      { internalType: 'uint256', name: 'b', type: 'uint256' },
    ],
    name: 'multiply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'a', type: 'uint256' },
      { internalType: 'uint256', name: 'b', type: 'uint256' },
    ],
    name: 'subtract',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'usageCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const calculatorAddress = '0x0bdad987f8A762aE61fe07592Fb8bDD1b2F6937c'

const provider = new ethers.providers.JsonRpcProvider('адреса_вузла')
const signer = provider.getSigner()

function App() {
  const [firstValue, setFirstValue] = useState(0)
  const [operation, setOperation] = useState('+')
  const [secondValue, setSecondValue] = useState(0)
  const [usageCount, setUsageCount] = useState(0)
  const [result, setResult] = useState('')
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false)
  const [calculatorContract, setCalculatorContract] = useState(null)

  const handleOperationChange = (e) => {
    setOperation(e.target.value)
  }

  const handleCalculate = async () => {
    try {
      const a = ethers.BigNumber.from(firstValue)
      const b = ethers.BigNumber.from(secondValue)

      let calculatedResult

      if (operation === '+') {
        calculatedResult = await calculatorContract.add(a, b)
      } else if (operation === '-') {
        calculatedResult = await calculatorContract.subtract(a, b)
      } else if (operation === '*') {
        calculatedResult = await calculatorContract.multiply(a, b)
      } else if (operation === '/') {
        calculatedResult = await calculatorContract.divide(a, b)
      }

      setResult(calculatedResult.toString())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const connectToProvider = async () => {
      try {
        if (isMetaMaskInstalled()) {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          setIsMetaMaskConnected(true)

          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()

          const contract = new ethers.Contract(calculatorAddress, calculatorABI, signer)
          setCalculatorContract(contract)

          const count = await contract.usageCount()
          setUsageCount(count.toNumber())
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error)
      }
    };

    const fetchData = async () => {
      await connectToProvider()
    };

    fetchData();
  }, [])

  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined'
  };

  const isCalculateButtonDisabled = !isMetaMaskConnected || !calculatorContract

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ marginBottom: '10px' }}>
          <input type="number" value={firstValue} onChange={(e) => setFirstValue(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select value={operation} onChange={handleOperationChange}>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input type="number" value={secondValue} onChange={(e) => setSecondValue(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleCalculate} disabled={isCalculateButtonDisabled}>
            Calculate
          </button>
        </div>
        <div>Result: {result}</div>
        {(isMetaMaskConnected || calculatorContract) && <div>Calculator used: {usageCount}</div>}
      </div>
  );
}

export default App;
