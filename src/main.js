import './style.css'

"use strict";

const API_KEY = '3c4a66f8-df07-4699-8549-23f1ab6ce3cf'; 
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
};

const cryptoHistory = [];
const cryptos = [];
// spread operator
const combined = [...cryptos, ...cryptoHistory];

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById("btn");
  const btn2 = document.getElementById("btn2");

  if (btn) {
    btn.addEventListener("click", async event => {
      event.preventDefault();
      let currency = document.getElementById("currency").value;
      let crypto = document.getElementById("crypto").value;
      let amount = document.getElementById("amount").value;

      localStorage.setItem('crypto', crypto);
      localStorage.setItem('amount', amount);
      localStorage.setItem('currency', currency);

      cryptoHistory.push(crypto);

      if(crypto && currency){
        try {
          const data = await fetchData(crypto, currency);
          displayRate(data);
          // Set icons after successful swap
          setCryptoImage(crypto);
          setCurrencyImage(currency);
        }
        catch(error){
          console.log(error);
          ErrorAnimation();
        }
      }
      else{
        ErrorAnimation();
      }
    });
  }

  if (btn2) {
    btn2.addEventListener("click", async event => {
      event.preventDefault();
      getHistory(cryptoHistory);
    });
  }
});

let setCryptoImage = (cryptoName) => {
  const imgElement = document.getElementById('crypto-image');
  if (cryptoName.trim()) { // Check if cryptoName is not empty
    const imgPath = `/src/assets/icons/svg/${cryptoName.toLowerCase()}.svg`;
    console.log('Setting crypto image:', imgPath); // Debug log
    imgElement.src = imgPath;
    imgElement.style.display = 'block';
    imgElement.style.width = '24px';
    imgElement.style.height = '24px';
    imgElement.style.borderRadius = '50%';
    imgElement.style.backgroundColor = cryptoName.toLowerCase() === 'btc' ? '#F7931A' : '#627EEA';
  } else {
    imgElement.style.display = 'none'; // Hide the image if no crypto is entered
  }
}

let setCurrencyImage = (currencyName) => {
  const imgElement = document.getElementById('currency-image');
  const imgPath = `/src/assets/icons/svg/${currencyName.toLowerCase()}.svg`;
  console.log('Setting currency image:', imgPath); // Debug log
  imgElement.src = imgPath;
  imgElement.style.display = 'block';
  imgElement.style.width = '24px';
  imgElement.style.height = '24px';
  imgElement.style.borderRadius = '50%';
  imgElement.style.backgroundColor = '#4CAF50';
}

function fetchData(crypto, currency) {
  return new Promise(async (resolve, reject) => {
    try {
      // Using a CORS proxy to bypass the CORS restriction
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      // Switch to production API endpoint instead of sandbox
      const apiUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto.toUpperCase()}&convert=${currency}`;
      
      console.log('Fetching from:', apiUrl);
      
      const symbolResponse = await fetch(corsProxy + apiUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
          'Accept': 'application/json',
          'Origin': 'http://localhost:5173'
        }
      });
      
      if (!symbolResponse.ok) {
        throw new Error(`Error status: ${symbolResponse.status}`);
      }
      
      const data = await symbolResponse.json();
      console.log('API Response:', data); // Debug log
      
      if (!data.data || !data.data[crypto.toUpperCase()]) {
        throw new Error(`Cryptocurrency ${crypto} not found. Please check the symbol.`);
      }

      const cryptoData = data.data[crypto.toUpperCase()];
      const quote = cryptoData.quote[currency];
      
      if (!quote || !quote.price) {
        throw new Error(`Price data not available for ${crypto}/${currency}`);
      }
      
      // Ensure we're getting the actual price
      resolve({
        rate: parseFloat(quote.price),
        time: quote.last_updated
      });
    } catch (error) {
      console.error('API Error:', error);
      reject(error);
    }
  });
}

let getSymbol = currency => {
  return currencySymbols[currency];
}

let displayRate = (data) => {
  const {rate, time} = data;
  let currency = document.getElementById("currency").value;
  let crypto = document.getElementById("crypto").value;
  let syb = getSymbol(currency);
  let amount = document.getElementById("amount").value;

  setCryptoImage(crypto);
  setCurrencyImage(currency);

  // Get all placeholder lines
  const placeholderLines = document.querySelectorAll('.placeholder-line');
  
  if (!crypto || !currency) {
    // If no swap is happening, ensure placeholders are visible
    placeholderLines.forEach(line => {
      line.style.display = 'block';
    });
    return;
  }

  // Format the numbers with proper grouping and decimals
  const formattedRate = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(rate);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(rate * amount);

  // Hide the placeholder lines when displaying actual data
  placeholderLines.forEach(line => {
    line.style.display = 'none';
  });

  // Create the output elements with the same style as placeholders
  const amountLine = document.createElement('div');
  const rateLine = document.createElement('div');
  const timeLine = document.createElement('div');

  // Apply the same styles as placeholder lines
  [amountLine, rateLine, timeLine].forEach(line => {
    line.style.backgroundColor = '#2c2c2c';
    line.style.padding = '15px';
    line.style.borderRadius = '8px';
    line.style.margin = '10px 0';
    line.style.color = '#ffffff';
    line.style.textAlign = 'left';  // Align text to the left
    line.style.paddingLeft = '20px'; // Add some padding on the left
  });

  // Set the content
  amountLine.textContent = `Amount: ${syb} ${formattedAmount}`;
  rateLine.textContent = `Rate: ${syb} ${formattedRate}`;
  timeLine.textContent = `Time: ${new Date(time).toLocaleString()}`;

  // Clear previous output
  const outputDiv = document.querySelector('.output');
  outputDiv.innerHTML = '';

  // Add the new elements
  outputDiv.appendChild(amountLine);
  outputDiv.appendChild(rateLine);
  outputDiv.appendChild(timeLine);
}

let ErrorAnimation = () => {
  const div = document.getElementById('container');
  div.classList.toggle("error-message");
}

document.addEventListener('DOMContentLoaded', () => {
  const cryptoInput = document.getElementById("crypto");
  const currencySelect = document.getElementById("currency");

  cryptoInput.addEventListener('blur', (event) => {
    const cryptoValue = event.target.value.trim().toUpperCase();
    // Check if the input matches a known cryptocurrency ticker
    if (cryptoValue && isValidCrypto(cryptoValue)) {
      setCryptoImage(cryptoValue);
    } else {
      // Hide the icon if the input doesn't match a known ticker
      document.getElementById('crypto-image').style.display = 'none';
    }
  });

  currencySelect.addEventListener('change', (event) => {
    const currencyValue = event.target.value;
    setCurrencyImage(currencyValue);
  });

  // Set initial currency icon
  setCurrencyImage(currencySelect.value);
});

// Function to validate if the input is a known cryptocurrency ticker
function isValidCrypto(ticker) {
  // Add known cryptocurrency tickers here
  const knownCryptos = ['BTC', 'ETH', 'LTC', 'XRP', 'BCH'];
  return knownCryptos.includes(ticker);
}

let getHistory = (cryptoHistory) => {
  let history = document.getElementById("history");
  history.textContent = "";
  
  for (const crypto of cryptoHistory) {
    const li = document.createElement('li');
    li.textContent = crypto;
    history.appendChild(li);
  }
}

let getHighestRate = (...cryptos) => {
  return Math.max(...cryptos);
}
