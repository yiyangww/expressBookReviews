const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Validate user credentials
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const accessToken = jwt.sign(
      {
        data: { username },
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Save user credentials for the session
    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({
      message: "User successfully logged in",
    });
  } else {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Initialize reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or modify the review for this user
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully",
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if reviews exist for this book
  if (!books[isbn].reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  // Check if user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
