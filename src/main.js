import './style.css'

"use strict";

const API_KEY = '413bc07b-af46-4523-a48b-412fc521c1c9';

const form = document.getElementById("form");

async function fetchData(crypto, currency) {
  try {
    const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${crypto}/${currency}`, {
      headers: {
        'X-CoinAPI-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Exchange rate: 1 ${crypto} = ${data.rate} ${currency} (as of ${data.time})`);
  } catch (error) {
    console.error('Error fetching data from CoinAPI.io:', error);
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const currency = document.getElementById("currency").value;
  const crypto = document.getElementById("crypto").value;
  fetchData(crypto, currency);
});

