const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userWithSameName = users.filter((user) => {
        return user.username === username;
    });
    if (userWithSameName.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validUsers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error loggin in!" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User successfully login" })
    }
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
        const review = req.body.review;
        book.reviews[username]=review;
        books[isbn]=book;
        res.send("Review added/updated successfully")
    }
    else{
        res.send("Unable to find book")
    }
    
});

// delete a book review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    if(books[isbn].reviews[username]){
        delete books[isbn].reviews[username];
        res.send("Review deleted successfully")
    }
    else{
        res.send("Unable to find review")
    }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
