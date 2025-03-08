document.addEventListener("DOMContentLoaded", () => {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const amountInput = document.getElementById("amount");
    const newsSection = document.getElementById("news-section");
    const newsContent = document.getElementById("news-content");
    
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            currencies.forEach(currency => {
                let option1 = document.createElement("option");
                option1.value = currency;
                option1.textContent = currency;
                fromCurrency.appendChild(option1);

                let option2 = document.createElement("option");
                option2.value = currency;
                option2.textContent = currency;
                toCurrency.appendChild(option2);
            });
        });

    function fetchNews(currency) {
        const apiKey = "6007898f799440c587ebce95f06f03b0";
        fetch(`https://newsapi.org/v2/everything?q=${currency} forex OR currency exchange OR financial market&language=en&sortBy=publishedAt&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                newsContent.innerHTML = "";
                if (data.articles && data.articles.length > 0) {
                    data.articles.slice(0, 3).forEach(article => {
                        const newsItem = document.createElement("p");
                        newsItem.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
                        newsContent.appendChild(newsItem);
                    });
                } else {
                    newsContent.innerHTML = "No recent currency news available.";
                }
            })
            .catch(() => newsContent.innerHTML = "Error fetching news.");
    }

    fromCurrency.addEventListener("change", () => fetchNews(fromCurrency.value));
    toCurrency.addEventListener("change", () => fetchNews(toCurrency.value));
});

function convertCurrency() {
    const amount = document.getElementById("amount").value;
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const resultDisplay = document.getElementById("result");

    if (amount === "" || isNaN(amount)) {
        resultDisplay.textContent = "Please enter a valid amount";
        return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            resultDisplay.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        })
        .catch(() => resultDisplay.textContent = "Error fetching exchange rate");
}
