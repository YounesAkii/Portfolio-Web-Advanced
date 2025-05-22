# Portfolio Web Advanced

## Projectbeschrijving
Dit project is een webapplicatie die real-time cryptocurrency prijzen toont. Gebruikers kunnen zoeken naar verschillende cryptocurrencies. Ze kunnen de prijs van een crypto-currency opvragen in verschillende munteneenheden (Dollar, Yen, GBP etc.). Ze kunnen hun favoriete crypto-munten opslaan door ze een hartje te geven. 

De tabel toont de huidige top-100 crypto-munten. De zoekbalk kan de gebruiker gebruiken om te zoeken naar een crypto die in de top 100 zit. De gebruiker kan ook aan de prijs van de meeste crypto-munten komen, ook buiten de top 100, door de swap-functie, waarin hij wel de ticker en niet de volledige naam van de crypto moet invullen.

## Functionaliteiten
- Tabel met huidige top-100 cryptocurrencies
- Real-time cryptocurrency prijzen
- Favorieten opslaan
- Thema en taalvoorkeuren instellen

## Gebruikte API's
- [CoinMarketCap API](https://coinmarketcap.com/api/)

## Technische Implementatie
DOM manipulatie

Elementen selecteren: Lijn 5,74,90,95,100 in main.js

Elementen manipuleren: Lijn 16,74,223 in main.js

Events aan elementen koppelen: Lijn 74,230 in main.js


Modern JavaScript

Gebruik van constanten: Lijn 5 in main.js

Template literals: Lijn 492 in main.js

Iteratie over arrays: Lijn 431 in main.js

Array methodes: Lijn 431 in main.js

Arrow functions: Lijn 26 in main.js

Conditional (ternary) operator (moderne if..else): Lijn 564 in main.js

Callback functions: Lijn 222 in main.js

Promises: Lijn 94 in main.js

Async & Await: Lijn 265, 26 in main.js


Data & API

Fetch om data op te halen: Lijn 103 in main.js

JSON manipuleren en weergeven: Lijn 115 in main.js


Opslag & validatie

Formulier validatie: Lijn 33 in main.js

Gebruik van LocalStorage: Lijn 38,39,40 in main.js


Styling & layout

Basis HTML layout (flexbox of CSS grid kan hiervoor worden gebruikt): Lijn 11 in index.html

Basis CSS: Lijn 8 in style.css

Gebruiksvriendelijke elementen (verwijderknoppen, icoontjes,...): Lijn 49 in index.html


Tooling & structuur:

Project is opgezet met Vite: Lijn 7 in package.json

Een correcte folderstructuur wordt aangehouden (gescheiden html, css en js files, src folder, dist folder, ...)

## Installatiehandleiding
1. Clone de repository: `git clone <repository-url>`
2. Navigeer naar de projectmap: `cd Portfolio-Web-Advanced`
3. Installeer de afhankelijkheden: `npm install`
4. Start de applicatie: `npm run dev`
5. Belangrijk: Om CORS-beperkingen te omzeilen tijdens de ontwikkeling, gebruik ik CORS Anywhere.
    Bezoek deze link: https://cors-anywhere.herokuapp.com/corsdemo en klik op de knop "Request temporary access to the demo server".
    Dit geeft je tijdelijk toegang om externe API’s te kunnen aanspreken in de browser.

## Screenshots
Homepage in dark mode
![image](https://github.com/user-attachments/assets/fc6a575d-bcda-4f1f-a3a5-9af9017a607c)
Swap-functie met ticker ETC
![image](https://github.com/user-attachments/assets/fc637b0d-2abf-405d-9792-6114ca788d15)
Swap-functie naar andere currency
![image](https://github.com/user-attachments/assets/000a27bf-fe00-42e1-877f-c3cfabf73496)
Homepage in light mode
![image](https://github.com/user-attachments/assets/0b0afcb6-9dcc-475b-ba18-288c332417ce)
De zoekbalk gebruiken om door de top-100 te zoeken
![image](https://github.com/user-attachments/assets/d2f05e64-6932-45f0-b5e6-8b58517240a1)
Zoeken + filteren voor prijzen tussen 1 en 100 Dollar
![image](https://github.com/user-attachments/assets/cc90d131-1a20-4e06-900a-66ac9b16e22d)
Zoeken + Alle prijzen + Geordend van lage tot hoge prijzen
![image](https://github.com/user-attachments/assets/a92e8453-4e8b-431b-a6ef-32aa4ddf7831)
Zoeken + Alle prijzen + Geordend door 24u verandering (Hoog-laag)
![image](https://github.com/user-attachments/assets/c27a242c-4137-4a28-8cf5-f12e5957ce23)
Het is mogelijk om je locatie te geven door te drukken op de speld rechtsboven
![image](https://github.com/user-attachments/assets/f88a2c5b-91e7-4211-a3e3-3c6b804b2ef3)
De tabel gefilterd door 24u verandering (Hoog-laag)
![image](https://github.com/user-attachments/assets/f9727c18-7aa5-497f-aba3-6e4a92b19661)
De tabel gefilterd door naam (A-Z)
![image](https://github.com/user-attachments/assets/1c05eb08-ea85-4c81-8eed-c7e6e59579bb)
De tabel gefilterd om prijzen van 100 tot 1000 Dollar te zien
![image](https://github.com/user-attachments/assets/ffbc160b-e048-45de-80d9-6174db40ff3d)
Top 3 toegevoegd aan favorieten, blijft behouden ookal wordt er gerefresht
![image](https://github.com/user-attachments/assets/8a14d122-84f1-4c3c-a281-2ef6ded4afff)




## Gebruikte Bronnen
- TRAE IDE , there is no AI chatlog that's shareable as with chatgpt. I did use it frequently.
- https://chatgpt.com/share/682e404d-6f78-800e-976d-2167e03e08cc
- https://chatgpt.com/share/682e407e-4bbc-800e-af78-9a5d69a21f8e 

## Opmerking over CORS
Dit project gebruikt de gratis proxydienst CORS Anywhere om CORS (Cross-Origin Resource Sharing) beperkingen te omzeilen tijdens de ontwikkeling.
CORS is een browserbeveiliging die voorkomt dat een website zomaar data kan opvragen van een andere domein. In een productieomgeving zou dit niet veilig of schaalbaar zijn.

Voor een echte productieversie zou ik:
    De API-aanroepen via een eigen back-end server laten lopen
    of een API gebruiken die native CORS ondersteunt voor mijn domein.
    Deze proxy-oplossing is enkel tijdelijk bedoeld voor lokale ontwikkeling en demo-doeleinden.
