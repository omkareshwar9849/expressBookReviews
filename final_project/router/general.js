const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registerd now you can login!" });
        }
        else {
            return res.status(404).json({ message: "User already exist!" });
        }
    }
    else {
        return res.status(404).json({ message: "Unable to register User." });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    res.send(JSON.stringify(books, null, 11));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const authorName = req.params.author;
    const foundBooks = {};
    for (bookId in books) {
        const book = books[bookId];
        if (book.author.toLowerCase() === authorName.toLowerCase()) {
            foundBooks[bookId] = book;
        }
    }
    res.send(foundBooks)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const bookTitle = req.params.title;
    const foundBooks = {};
    for (bookId in books) {
        const book = books[bookId];
        if (book.title.toLowerCase() === bookTitle.toLowerCase()) {
            foundBooks[bookId] = book;
        }
    }
    res.send(JSON.stringify(foundBooks, null, 2))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const isbn = req.params.isbn;
    const book = books[isbn];
    const reviews = book.reviews;
    //res.send(JSON.stringify(reviews,null,2))
    res.send(reviews);
});

module.exports.general = public_users;


//Task 10:
// Define an async function to get all books
async function getAllBooks(callback) {
    try {
        setTimeout(() => {
            const bookList = Object.values(books);
            callback(null, bookList);
        }, 1000);
    } catch (error) {
        callback(error, null);
    }
}

// Usage: Call the getAllBooks function with a callback
getAllBooks((error, booksList) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("All Books:", booksList);
    }
});

//Task 11:
// Function to search for a book by ISBN using a Promise
function searchBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = Object.values(books[isbn]);
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        }, 1000);
    });
}

// Usage: Search for a book by ISBN
const isbnToSearch = 3;
searchBookByISBN(isbnToSearch)
    .then(book => {
        console.log("Book Found:", book);
    })
    .catch(error => {
        console.error("Error:", error);
    });

//Task 12:
// Function to search for books by an author using a Promise
function searchBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const authorBooks = Object.values(books).filter(book => book.author === author);
            if (authorBooks.length > 0) {
                resolve(authorBooks);
            } else {
                reject("No books by this author found");
            }
        }, 1000);
    });
}

// Usage: Search for books by an author
const authorToSearch = "omkar";
searchBooksByAuthor(authorToSearch)
    .then(books => {
        console.log("Books Found:", books);
    })
    .catch(error => {
        console.error("Error:", error);
    });


// Task 13:
// Function to search for books by an title using a Promise
function searchBooksBytitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const titlBooks = Object.values(books).filter(book => book.title === title);
            if (titlBooks.length > 0) {
                resolve(titlBooks);
            } else {
                reject("No books by this title found");
            }
        }, 1000);
    });
}

// Usage: Search for books by an title
const titleToSearch = "Things Fall Apart";
searchBooksBytitle(titleToSearch)
    .then(books => {
        console.log("Books Found:", books);
    })
    .catch(error => {
        console.error("Error:", error);
    });
