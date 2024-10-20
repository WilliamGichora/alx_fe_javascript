document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quoteDisplay')
    const showQuoteBtn = document.getElementById('newQuote')

    const form = document.getElementById('form')
    const newQuoteInput = document.getElementById('newQuoteText')
    const newQuoteCategory = document.getElementById('newQuoteCategory')
    const addNewQuoteBtn = document.getElementById('addNewQuoteBtn')

    const randomQuoteP = document.createElement('p')

    const downloadQuoteBtn = document.getElementById('downloadQuotes')

    loadQuotes();

    showQuoteBtn.addEventListener('click', showRandomQuote)

    addNewQuoteBtn.addEventListener('click', createAddQuoteForm)

    downloadQuoteBtn.addEventListener('click', downloadAllQuotes)

    document.getElementById('importFile').addEventListener('change', importFromJsonFile)

    function createAddQuoteForm() {
        let inputText = newQuoteInput.value.trim()
        let newCategoryText = newQuoteCategory.value.trim()

        if (inputText === '' || newCategoryText === '') {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = {
            text: inputText,
            category: newCategoryText
        }

        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        const quoteExists = storedQuotes.some(quote => quote.text === newQuote.text && quote.category === newQuote.category);

        if (!quoteExists) {
            saveQuotes(storedQuotes, newQuote)

            newQuoteInput.value = '';
            newQuoteCategory.value = '';

            displayQuote(newQuote);
        } else {
            alert("This quote already exists!");
        }

    }

    function saveQuotes(storedQuotes,newQuote) {
        storedQuotes.push(...newQuote);
        localStorage.setItem('quotes', JSON.stringify(storedQuotes));
    }

    function displayQuote(quote) {
        const newQuoteDiv = document.createElement('div');
        const newQuoteP = document.createElement('p');
        newQuoteP.innerHTML = `${quote.text} <br/> ${quote.category}`;
        newQuoteDiv.appendChild(newQuoteP);
        quoteContainer.appendChild(newQuoteDiv);
    }

    function showRandomQuote() {
        randomQuoteP.innerHTML = ''
        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        const index = Math.floor(Math.random() * storedQuotes.length)
        const quoteParagraph = storedQuotes[index]


        randomQuoteP.innerHTML = `${quoteParagraph.text} <br/> ${quoteParagraph.category}`

        document.querySelector('body').insertBefore(randomQuoteP, form)

        if (randomQuoteP.innerHTML !== '') {
            sessionStorage.setItem('LastViewedQuote', JSON.stringify(quoteParagraph))
        }

    }

    function loadQuotes() {
        const quotes = [
            {
                text: "Whoever is happy will make others happy.",
                category: "Happiness"
            },
            {
                text: "Everything you have ever wanted is sitting on the other side of fear.",
                category: "Motivational"
            },
            {
                text: "Keep on going.",
                category: "Motivational"
            }]

        let storedQuotes = JSON.parse(localStorage.getItem('quotes'));

        if (!Array.isArray(storedQuotes)) {
            storedQuotes = quotes;
            localStorage.setItem('quotes', JSON.stringify(storedQuotes));
        }

        console.log("Stored Quotes Array: ", storedQuotes);

        quoteContainer.innerHTML = '';

        storedQuotes.forEach(quote => {
            displayQuote(quote)
        });
    }

    function downloadAllQuotes() {
        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        const jsonString = JSON.stringify(storedQuotes)

        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'Quotes.json';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setTimeout(() => URL.revokeObjectURL(url), 1000);

    }

    async function importFromJsonFile(event) {
        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        const fileReader =  new FileReader();
        fileReader.onload = function (event) {
            const importedQuotes = JSON.parse(event.target.result);
            storedQuotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(storedQuotes));
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

})