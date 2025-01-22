const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const users = {};

regd_users.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users[username] = { username, password };
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const books = require('./booksdb.js'); // Preloaded book data
  res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const books = require('./booksdb.js');
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
      res.status(200).json(book);
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const books = require('./booksdb.js');
  const { author } = req.params;
  const results = Object.values(books).filter(book => book.author === author);
  res.status(200).json(results);
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const books = require('./booksdb.js');
  const { title } = req.params;
  const results = Object.values(books).filter(book => book.title === title);
  res.status(200).json(results);
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const books = require('./booksdb.js');
  const { isbn } = req.params;
  const book = books[isbn];
  if (book && book.reviews) {
      res.status(200).json(book.reviews);
  } else {
      res.status(404).json({ message: "Reviews not found" });
  }
});


module.exports.general = public_users;
