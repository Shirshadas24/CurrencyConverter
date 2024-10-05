const PROXY_URL = "https://cors-anywhere.herokuapp.com/"; // CORS proxy URL
const API_URL = "http://api.currencyapi.com/v3/latest?apikey=cur_live_jMtZSMB5q72z15v6s8Z33don2nRxCNq8NqU87a28";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Define countryList with currency codes and country codes
const countryList = {
    USD: 'US',
    INR: 'IN',
    EUR: 'EU',
    GBP: 'GB',
    AUD: 'AU',
    CAD: 'CA',
    // Add more currency codes and country codes as needed
};

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode of Object.keys(countryList)) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = PROXY_URL + API_URL;
    console.log(`Fetching data from: ${URL}`);

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log(`API response:`, data);

        // Adjust this based on actual API response structure
        let fromCurrency = fromCurr.value;
        let toCurrency = toCurr.value;

        // The API response structure
        let rates = data.data; // Assuming the rates are in `data.data`
        if (!rates[fromCurrency] || !rates[toCurrency]) {
            console.error('Currency code not found in response:', fromCurrency, toCurrency);
            msg.innerHTML = "Currency code not found.";
            return;
        }

        let fromRate = rates[fromCurrency].value;
        let toRate = rates[toCurrency].value;
        let rate = toRate / fromRate;
        let finalAmount = amtVal * rate;
        msg.innerHTML = `${amtVal} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error('Error fetching data:', error);
        msg.innerHTML = "Error fetching data: " + error.message;
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    if (img) img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
