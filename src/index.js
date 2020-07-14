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
    quotes.forEach(quote => {
        quoteCard(quote)
    })
}

// was inside quoteCard, but need global scope to access in sortBtn
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
    if (quote.likes){
        span.innerText = quote.likes.length
    } 
    else {
       span.innerText = 0
    }

    // functionality for likeBtn
    likeBtn.addEventListener("click", () => {
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify ({
                "quoteId": quote.id //using ID of current arg as quoteId for like
            })
        })
        .then(() => {
            let postLikes = parseInt(span.innerText)
            span.innerText = ++postLikes //++ needs to be before postLikes for it to work without having to refresh... not sure why tho
        })
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
            "Accept":"application/json"
        },
        body: JSON.stringify({
            "quote": event.target[0].value,
            "author": event.target[1].value
        })
    })
    .then (res => res.json())
    .then(quote => {
        quoteCard(quote)
        form.reset()
    })
})

// sortBtn
    // sortBtn sorts by uppercase and lowercase so all uppercase all evaluated together and then the same for lowercase
    // not fixable if I'm going to use the get request because that's inherent in the request order
const sortBtn = ce("button")
sortBtn.innerText ="Sort by Author"

const h1 = document.querySelector("h1")
h1.append(sortBtn)

sortBtn.addEventListener("click", () => {
    // need to reset what the page is already displaying when clicked
    quoteList.innerHTML= ""

    fetch("http://localhost:3000/quotes?_embed=likes&&_sort=author")
    .then(res => res.json())
    .then(quotes => showQuotes(quotes))
})

// call function to fetch and display from server
getQuotes()