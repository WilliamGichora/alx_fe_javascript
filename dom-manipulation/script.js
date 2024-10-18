document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quoteDisplay')
    const showQuoteBtn = document.getElementById('newQuote')

    const newQuoteInput = document.getElementById('newQuoteText')
    const newQuoteCategory = document.getElementById('newQuoteCategory')
    const addNewQuoteBtn = document.getElementById('addNewQuoteBtn')

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
            text: "Everything you have ever wanted is sitting on the other side of fear.",
            category: "Motivational"
        }]

    showQuoteBtn.addEventListener('click', showRandomQuote)
    
    addNewQuoteBtn.addEventListener('click', addQuote)

    function addQuote() {
        const inputText = newQuoteInput.value.trim()
        const newCategoryText = newQuoteCategory.value.trim()

        if (inputText === '' || newCategoryText === '') {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = {
            text: inputText,
            category: newCategoryText
        }

        quotes.push(newQuote)
        newQuoteInput.value = '';
        newQuoteCategory.value = '';

    }

    function showRandomQuote() {
        const index = Math.floor(Math.random() * quotes.length)
        console.log(index);

        const quoteParagraph = quotes[index]
        quoteContainer.textContent = quoteParagraph.text
    }

})