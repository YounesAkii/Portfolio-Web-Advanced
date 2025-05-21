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

      // Formulier validatie
      if (!currency || !crypto || !amount) {
        alert("Vul alstublieft alle velden in.");
        return;
      }

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

// Functie om meerdere cryptocurrencies op te halen
async function fetchCryptoList() {
  try {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `${CMC_API_URL}/cryptocurrency/listings/latest?limit=100`;
    
    const response = await fetch(corsProxy + apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    });

    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Functie om de cryptolijst weer te geven
let globalCryptoList = []; // Voeg deze globale variabele toe
let globalTbody = null; // Voeg deze globale variabele toe

// Functie om de cryptolijst weer te geven
function displayCryptoList(cryptoList) {
  globalCryptoList = cryptoList;
  const tableContainer = document.createElement('div');
  tableContainer.className = 'crypto-table-container';
  
  // Voeg zoek- en filterelementen toe
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'controls-container';
  
  // Initialiseer alle personalisatie features
  initializeThemePreferences();
  initializeLanguagePreferences();
  initializeGeolocationPreferences();
  
  // Zoekbalk
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Zoek cryptocurrency...';
  searchInput.className = 'search-input';
  
  // Filter voor prijsbereik
  const priceFilter = document.createElement('select');
  priceFilter.className = 'price-filter';
  priceFilter.innerHTML = `
    <option value="all">Alle prijzen</option>
    <option value="0-1">$0 - $1</option>
    <option value="1-100">$1 - $100</option>
    <option value="100-1000">$100 - $1000</option>
    <option value="1000+">$1000+</option>
  `;
  
  // Sorteer opties
  const sortSelect = document.createElement('select');
  sortSelect.className = 'sort-select';
  sortSelect.innerHTML = `
    <option value="rank">Rangschikking</option>
    <option value="name">Naam (A-Z)</option>
    <option value="price-high">Prijs (Hoog-Laag)</option>
    <option value="price-low">Prijs (Laag-Hoog)</option>
    <option value="change-high">24u Verandering (Hoog-Laag)</option>
    <option value="change-low">24u Verandering (Laag-Hoog)</option>
  `;

  // Define updateList function inside displayCryptoList
  function updateList() {
    const searchTerm = searchInput.value.toLowerCase();
    const priceRange = priceFilter.value;
    const sortBy = sortSelect.value;
    
    let filteredList = globalCryptoList.filter(crypto => {
      const matchesSearch = crypto.name.toLowerCase().includes(searchTerm) || 
                          crypto.symbol.toLowerCase().includes(searchTerm);
      
      const price = crypto.quote.USD.price;
      const matchesPrice = priceRange === 'all' ||
        (priceRange === '0-1' && price <= 1) ||
        (priceRange === '1-100' && price > 1 && price <= 100) ||
        (priceRange === '100-1000' && price > 100 && price <= 1000) ||
        (priceRange === '1000+' && price > 1000);
      
      return matchesSearch && matchesPrice;
    });
    
    // Sorteren
    filteredList.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-high':
          return b.quote.USD.price - a.quote.USD.price;
        case 'price-low':
          return a.quote.USD.price - b.quote.USD.price;
        case 'change-high':
          return b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h;
        case 'change-low':
          return a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h;
        default:
          return a.cmc_rank - b.cmc_rank;
      }
    });
    
    // Update tabelinhoud
    globalTbody.innerHTML = '';
    filteredList.forEach((crypto, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}. ${crypto.name}</td>
        <td>${crypto.symbol}</td>
        <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.price)}</td>
        <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.volume_24h)}</td>
        <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.market_cap)}</td>
        <td class="${crypto.quote.USD.percent_change_24h > 0 ? 'positive' : 'negative'}">
          ${crypto.quote.USD.percent_change_24h.toFixed(2)}%
        </td>
        <td>
          <button onclick="addToFavorites('${crypto.symbol}')" class="fav-btn">
            ${isFavorite(crypto.symbol) ? '❤️' : '🤍'}
          </button>
        </td>
      `;
      globalTbody.appendChild(row);
    });
  }
  
  // Add event listeners
  searchInput.addEventListener('input', updateList);
  priceFilter.addEventListener('change', updateList);
  sortSelect.addEventListener('change', updateList);
  
  // Voeg eerst alle basis elementen toe aan de DOM
  controlsContainer.appendChild(searchInput);
  controlsContainer.appendChild(priceFilter);
  controlsContainer.appendChild(sortSelect);
  tableContainer.appendChild(controlsContainer);
  
  // Voeg de tabel toe
  const table = document.createElement('table');
  table.className = 'crypto-table';
  
  // Tabelkop maken
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Symbol</th>
      <th>Price (USD)</th>
      <th>24h Volume</th>
      <th>Market Cap</th>
      <th>24h Change</th>
      <th>Favorite</th>
    </tr>
  `;
  
  // Tabelinhoud maken
  const tbody = document.createElement('tbody');
  globalTbody = tbody; // Sla de tbody globaal op
  cryptoList.forEach((crypto, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}. ${crypto.name}</td>
      <td>${crypto.symbol}</td>
      <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.price)}</td>
      <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.volume_24h)}</td>
      <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.market_cap)}</td>
      <td class="${crypto.quote.USD.percent_change_24h > 0 ? 'positive' : 'negative'}">
        ${crypto.quote.USD.percent_change_24h.toFixed(2)}%
      </td>
      <td>
        <button onclick="addToFavorites('${crypto.symbol}')" class="fav-btn">
          ${isFavorite(crypto.symbol) ? '❤️' : '🤍'}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);

  // Voeg de tabel toe aan de container
  tableContainer.appendChild(table);

  // Voeg de tableContainer toe aan de main container
  const mainContainer = document.querySelector('.main-container') || document.createElement('div');
  if (!mainContainer.className) {
    mainContainer.className = 'main-container';
    document.body.appendChild(mainContainer);
  }
  mainContainer.appendChild(tableContainer);

  // Nu pas de features initialiseren nadat de containers zijn toegevoegd aan de DOM
  initializeThemePreferences();
  initializeLanguagePreferences();
  initializeGeolocationPreferences();
}

// Functie om te controleren of een crypto favoriet is
function isFavorite(symbol) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  return favorites.includes(symbol);
}

// Functie om een crypto toe te voegen aan favorieten
function addToFavorites(symbol) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const index = favorites.indexOf(symbol);
  
  if (index === -1) {
    favorites.push(symbol);
  } else {
    favorites.splice(index, 1);
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Update alleen de specifieke favoriet knop
  const favButton = document.querySelector(`button[onclick="addToFavorites('${symbol}')"]`);
  if (favButton) {
    favButton.innerHTML = isFavorite(symbol) ? '❤️' : '🤍';
    
    // Voeg een kleine animatie toe
    favButton.style.transform = 'scale(1.2)';
    setTimeout(() => {
      favButton.style.transform = 'scale(1)';
    }, 200);
  }
}

// Make addToFavorites available globally
window.addToFavorites = addToFavorites;
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const cryptoList = await fetchCryptoList();
    displayCryptoList(cryptoList);
  } catch (error) {
    console.error('Error loading crypto list:', error);
    ErrorAnimation();
  }
});

// Functie om de lijst te filteren en sorteren
function updateList(searchInput, priceFilter, sortSelect) {
  const searchTerm = searchInput.value.toLowerCase();
  const priceRange = priceFilter.value;
  const sortBy = sortSelect.value;
  
  let filteredList = globalCryptoList.filter(crypto => {
    const matchesSearch = crypto.name.toLowerCase().includes(searchTerm) || 
                         crypto.symbol.toLowerCase().includes(searchTerm);
    
    const price = crypto.quote.USD.price;
    const matchesPrice = priceRange === 'all' ||
      (priceRange === '0-1' && price <= 1) ||
      (priceRange === '1-100' && price > 1 && price <= 100) ||
      (priceRange === '100-1000' && price > 100 && price <= 1000) ||
      (priceRange === '1000+' && price > 1000);
    
    return matchesSearch && matchesPrice;
  });
  
  // Sorteren
  filteredList.sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-high':
        return b.quote.USD.price - a.quote.USD.price;
      case 'price-low':
        return a.quote.USD.price - b.quote.USD.price;
      case 'change-high':
        return b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h;
      case 'change-low':
        return a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h;
      default:
        return a.cmc_rank - b.cmc_rank;
    }
  });
  
  // Update tabelinhoud
  globalTbody.innerHTML = '';
  filteredList.forEach((crypto, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}. ${crypto.name}</td>
      <td>${crypto.symbol}</td>
      <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.price)}</td>
      <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.volume_24h)}</td>
      <td>$${new Intl.NumberFormat('nl-NL').format(crypto.quote.USD.market_cap)}</td>
      <td class="${crypto.quote.USD.percent_change_24h > 0 ? 'positive' : 'negative'}">
        ${crypto.quote.USD.percent_change_24h.toFixed(2)}%
      </td>
      <td>
        <button onclick="addToFavorites('${crypto.symbol}')" class="fav-btn">
          ${isFavorite(crypto.symbol) ? '❤️' : '🤍'}
        </button>
      </td>
    `;
    globalTbody.appendChild(row);
  });
}

// Thema voorkeuren
function initializeThemePreferences() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
  themeToggle.onclick = toggleTheme;
  
  const controlsContainer = document.querySelector('.controls-container');
  if (controlsContainer) {
    controlsContainer.appendChild(themeToggle);
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  }
}

// Taalvoorkeur
function initializeLanguagePreferences() {
  const savedLanguage = localStorage.getItem('language') || 'nl';
  const languageSelect = document.createElement('select');
  languageSelect.className = 'language-select';
  languageSelect.innerHTML = `
    <option value="nl" ${savedLanguage === 'nl' ? 'selected' : ''}>Nederlands</option>
    <option value="en" ${savedLanguage === 'en' ? 'selected' : ''}>English</option>
    <option value="fr" ${savedLanguage === 'fr' ? 'selected' : ''}>Français</option>
  `;
  
  languageSelect.onchange = (e) => {
    localStorage.setItem('language', e.target.value);
    updateUILanguage(e.target.value);
  };
  
  const controlsContainer = document.querySelector('.controls-container');
  if (controlsContainer) {
    controlsContainer.appendChild(languageSelect);
  }
}

function updateUILanguage(language) {
  const translations = {
    nl: {
      search: 'Zoek cryptocurrency...',
      allPrices: 'Alle prijzen',
      ranking: 'Rangschikking',
      name: 'Naam (A-Z)',
      priceHigh: 'Prijs (Hoog-Laag)',
      priceLow: 'Prijs (Laag-Hoog)',
      change24h: '24u Verandering',
      changeHigh: '24u Verandering (Hoog-Laag)',
      changeLow: '24u Verandering (Laag-Hoog)'
    },
    en: {
      search: 'Search cryptocurrency...',
      allPrices: 'All prices',
      ranking: 'Ranking',
      name: 'Name (A-Z)',
      priceHigh: 'Price (High-Low)',
      priceLow: 'Price (Low-High)',
      change24h: '24h Change',
      changeHigh: '24h Change (High-Low)',
      changeLow: '24h Change (Low-High)'
    },
    fr: {
      search: 'Rechercher cryptocurrency...',
      allPrices: 'Tous les prix',
      ranking: 'Classement',
      name: 'Nom (A-Z)',
      priceHigh: 'Prix (Haut-Bas)',
      priceLow: 'Prix (Bas-Haut)',
      change24h: 'Variation 24h',
      changeHigh: 'Variation 24h (Haut-Bas)',
      changeLow: 'Variation 24h (Bas-Haut)'
    }
  };

  const t = translations[language];
  
  // Update UI elements
  const searchInput = document.querySelector('.search-input');
  if (searchInput) searchInput.placeholder = t.search;
  
  const priceFilter = document.querySelector('.price-filter');
  if (priceFilter) priceFilter.querySelector('option[value="all"]').textContent = t.allPrices;
  
  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    const options = sortSelect.querySelectorAll('option');
    options[0].textContent = t.ranking;
    options[1].textContent = t.name;
    options[2].textContent = t.priceHigh;
    options[3].textContent = t.priceLow;
    options[4].textContent = t.changeHigh;
    options[5].textContent = t.changeLow;
  }
}

// Geolocatie voorkeuren
function initializeGeolocationPreferences() {
  if ("geolocation" in navigator) {
    const geoButton = document.createElement('button');
    geoButton.className = 'geo-button';
    geoButton.innerHTML = '📍';
    geoButton.onclick = toggleGeolocation;
    
    const controlsContainer = document.querySelector('.controls-container');
    if (controlsContainer) {
      controlsContainer.appendChild(geoButton);
    }
  }
}

function toggleGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        alert(`Locatie opgeslagen: ${latitude}, ${longitude}`);
      },
      (error) => {
        console.error('Geolocatie error:', error);
        alert('Kon locatie niet ophalen. Controleer of u toegang heeft gegeven tot locatie.');
      }
    );
  }
}

// API Data Caching
function cacheApiData(data) {
  const cacheTime = new Date().getTime();
  localStorage.setItem('cryptoData', JSON.stringify({
    data: data,
    timestamp: cacheTime
  }));
}

async function getCachedOrFreshData() {
  const cached = localStorage.getItem('cryptoData');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    const cacheAge = now - timestamp;
    
    // Cache verversen na 5 minuten
    if (cacheAge < 300000) {
      return data;
    }
  }
  
  const freshData = await fetchCryptoList();
  cacheApiData(freshData);
  return freshData;
}


