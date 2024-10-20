document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quoteDisplay')
    const showQuoteBtn = document.getElementById('newQuote')
    const form = document.getElementById('form')
    const newQuoteInput = document.getElementById('newQuoteText')
    const newQuoteCategory = document.getElementById('newQuoteCategory')
    const addNewQuoteBtn = document.getElementById('addNewQuoteBtn')
    const randomQuoteP = document.createElement('p')
    const downloadQuoteBtn = document.getElementById('downloadQuotes')
    const categoryFilter = document.getElementById('categoryFilter')

    populateCategories()
    loadQuotes();

    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory
    filterQuotes();

    showQuoteBtn.addEventListener('click', showRandomQuote)
    addNewQuoteBtn.addEventListener('click', createAddQuoteForm)
    downloadQuoteBtn.addEventListener('click', downloadAllQuotes)
    document.getElementById('importFile').addEventListener('change', importFromJsonFile)
    categoryFilter.addEventListener('change', filterQuotes)


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
            storedQuotes.push(newQuote);
            localStorage.setItem('quotes', JSON.stringify(storedQuotes));
            newQuoteInput.value = '';
            newQuoteCategory.value = '';

            displayQuote(newQuote);
            window.location.reload()
        } else {
            alert("This quote already exists!");
        }

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
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            const importedQuotes = JSON.parse(event.target.result);
            storedQuotes.push(...importedQuotes);
            localStorage.setItem('quotes', JSON.stringify(storedQuotes));
            alert('Quotes imported successfully!');
            populateCategories()
            window.location.reload()
        };
        fileReader.readAsText(event.target.files[0]);

    }

    function populateCategories() {
        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        const categories = storedQuotes.map(quote => quote.category).filter((category, index, self) => self.indexOf(category) === index)
        console.log(categories);

        while (categoryFilter.childNodes.length > 2) {
            categoryFilter.removeChild(categoryFilter.lastChild)
        }

        categories.forEach(quote => {
            const option = document.createElement('option')
            option.textContent = `${quote}`
            option.value = quote

            categoryFilter.appendChild(option)
        })

        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
        categoryFilter.value = lastSelectedCategory
    }

    function filterQuotes(category) {
        const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]')
        const selectedCategory = categoryFilter.value
        const categoryQuotes = storedQuotes.filter(quote => quote.category === selectedCategory)

        quoteContainer.innerHTML = ''

        if (selectedCategory === 'all') {
            storedQuotes.forEach(quote => displayQuote(quote))
        } else {
            categoryQuotes.forEach(quote => displayQuote(quote))

        }

        localStorage.setItem('lastSelectedCategory', selectedCategory)

    }

    async function fetchQuotesFromServer(quote) {
        const url = "https://jsonplaceholder.typicode.com/posts"

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quote)
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const quotes = await response.json()
        } catch (error) {
            console.error(error);

        }
    }

    function syncQuotes(serverQuotes) {
        const localQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');

        let updatedQuotes = [...serverQuotes];

        const conflictFound = localQuotes.some(localQuote => {
            return !serverQuotes.find(serverQuote => serverQuote.text === localQuote.text && serverQuote.category === localQuote.category);
        });

        localQuotes.forEach(localQuote => {
            if (!serverQuotes.some(serverQuote => serverQuote.text === localQuote.text && serverQuote.category === localQuote.category)) {
                updatedQuotes.push(localQuote);
            }
        });

        localStorage.setItem('quotes', JSON.stringify(updatedQuotes));

        if (conflictFound) {
            alert('Data synced with server, and conflicts were resolved using server data.');
        } else {
            alert('Data synced successfully.');
        }
    }

    function startPeriodicSync(interval = 60000) {
        setInterval(fetchQuotesFromServer, interval);
    }

})