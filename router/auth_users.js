const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

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


//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.token = token;
  res.status(200).json({ message: "Login successful", token });
});
// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username; // Assumes a middleware sets `req.user`
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!books[isbn].reviews) books[isbn].reviews = {};
  books[isbn].reviews[username] = review;
  res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Assumes a middleware sets `req.user`
  if (!books[isbn] || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }
  delete books[isbn].reviews[username];
  res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
