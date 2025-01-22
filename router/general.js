const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
      const books = await getBooks(); // Simulating an async operation
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Simulate an async function to get books
async function getBooks() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (books) resolve(books);
          else reject("No books found");
      }, 500); // Simulated delay
  });
}



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  findBookByISBN(isbn)
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(404).json({ message: "Book not found", error }));
});

// Function to find book by ISBN using a Promise
function findBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject(`No book found with ISBN: ${isbn}`);
  });
}


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  findBooksByAuthor(author)
      .then((booksByAuthor) => res.status(200).json(booksByAuthor))
      .catch((error) => res.status(404).json({ message: "No books found", error }));
});

// Function to find books by author using a Promise
function findBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
      const results = Object.values(books).filter((book) => book.author === author);
      if (results.length > 0) resolve(results);
      else reject(`No books found by author: ${author}`);
  });
}



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
      const booksByTitle = await findBooksByTitle(title);
      res.status(200).json(booksByTitle);
  } catch (error) {
      res.status(404).json({ message: "No books found", error });
  }
});

// Function to find books by title using async/await
async function findBooksByTitle(title) {
  return new Promise((resolve, reject) => {
      const results = Object.values(books).filter((book) => book.title === title);
      if (results.length > 0) resolve(results);
      else reject(`No books found with title: ${title}`);
  });
}



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
