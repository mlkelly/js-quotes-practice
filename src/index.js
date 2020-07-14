// helper methods
function ce(element){
    return document.createElement(element)
}

// GET quotes
function getQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => showQuotes(quotes))
}

// iterating through Quotes
function showQuotes(quotes){
    quoteList.innerHTML= "" //added here to avoid error when toggling button
    quotes.forEach(quote => {
        quoteCard(quote)
    })
}

// was inside quoteCard, but need global scope to access in sortBtn/showQuotes
const quoteList = document.querySelector("ul#quote-list")

// create/append single quote card
function quoteCard(quote){
   const li = ce("li")
   li.className = "quote-card"
   
   const blockquote = ce("blockquote")
   blockquote.className = "bloackquote"

   const p = ce("p")
   p.className = "mb-0"
   p.innerText = quote.quote // Quote body

   const footer = ce("footer")
   footer.className = "blockquote-footer"
   footer.innerText = quote.author // Quote author
   
   const br = ce("br")

   const likeBtn = ce("button")
   likeBtn.className = "btn-success"
   likeBtn.innerText = "Likes:"
   
   // goes inside likeBtn
   const span = ce("span")
   span.innerText = quote.likes.length
    // longer syntax, but now need to add quote.likes =[] in form fetch request bc form doesn't have like input field to create the key
    // if (quote.likes){
    //     span.innerText = quote.likes.length
    // } 
    // else {
    //    span.innerText = 0
    // }

    // functionality for likeBtn
    likeBtn.addEventListener("click", () => {
        // post request is creating new likes in server
        fetch("http://localhost:3000/likes", {
            method: "POST", //post bc creating a new like instance for that post, not updating a previous like
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify ({
                quoteId: quote.id //using ID of current arg as quoteId for like
            })
        })
        //.then updates button number
        .then(() => {
            let postLikes = parseInt(span.innerText)
            span.innerText = ++postLikes //++ needs to be before postLikes for it to work without having to refresh... not sure why tho
        })
        //.then(() => span.innerText = ++quote.likes.length)
            // alternate syntax
    })

   const deleteBtn = ce("button")
   deleteBtn.className = "btn-danger"
   deleteBtn.innerText = "Delete"
   
   // functionality for deleteBtn
   deleteBtn.addEventListener("click", () => {
       fetch (`http://localhost:3000/quotes/${quote.id}`, {
           method: "DELETE"
       })
       .then ((quote) => li.remove(quote))
   })

   // append card to screen 
   quoteList.append(li)
   li.append(blockquote)
   blockquote.append(p, footer, br, likeBtn, deleteBtn)
   likeBtn.append(span)
}

// form submission
const form = document.querySelector("form#new-quote-form")
form.addEventListener("submit", (event) => {
    event.preventDefault()

    // posting the submission to the server
    fetch ("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            // "Accept":"application/json"
        },
        body: JSON.stringify({
            quote: event.target[0].value,
            author: event.target[1].value
            // could also write as:
                // quote: form[0].value,
                // author: form[1].value
            // because we already have a const qs that finds the form called "form"
        })
    })
    .then (res => res.json())
     // pessimistic rendering
    .then(quote => {
        quote.likes = []
        quoteCard(quote)
        form.reset()
    })

    // optimistic rendering
        // possibility that rendering might happen before new quote is inserted bc not waiting for fetch request ot happen before calling the below func
    //.then(quote => getQuotes())
})

// sortBtn
    // sortBtn sorts by uppercase and lowercase so all uppercase all evaluated together and then the same for lowercase
    // not fixable if I'm going to use the get request because that's inherent in the request order
const sortBtn = ce("button")
sortBtn.innerText ="Sort by Author"

const h1 = document.querySelector("h1")
h1.append(sortBtn)

sortBtn.addEventListener("click", () => {
    sortByAuthor()
})

// helper method for sortBtn eventListener
function sortByAuthor(){
    // need to reset what the page is already displaying when clicked
    quoteList.innerHTML= ""

    fetch("http://localhost:3000/quotes?_embed=likes&&_sort=author")
    .then(res => res.json())
    .then(quotes => showQuotes(quotes))

}

// call function to fetch and display from server
getQuotes()