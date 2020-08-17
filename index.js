const axios = require('axios');

const FIXER_API_KEY = '';
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;
const REST_COUNTRIES_API = `https://restcountries.eu/rest/v2/currency`;

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const { data: { rates } } = await axios.get(FIXER_API);
        const currencyUnit = 1 / rates[fromCurrency]
        const exchangeRate = currencyUnit * rates[toCurrency];
        return exchangeRate;
    } catch (error) {
        throw new Error(`unable to getcurrency ${fromCurrency} to ${toCurrency}`);
    }
}

const getCountries = async (currencyCode) => {
    try {
        const { data } = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);
        return data.map(({ name }) => name)
    } catch (error) {
        throw new Error(`unable to countries that use ${currencyCode}`);
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    const [countries, exchangeRate] = await Promise.all([
        getCountries(toCurrency),
        getExchangeRate(fromCurrency, toCurrency)
    ]);

    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
    
    You can spend these in the following countries: ${countries}.`
}

convertCurrency('AUD', 'CAD', 20)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));

// const result = await convertCurrency('AUD', 'CAD', 20); // worlks on node > 14.2