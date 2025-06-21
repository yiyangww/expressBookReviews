const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User registered successfully",
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get the book list available in the shop using Promise callbacks or async-await with Axios
public_users.get("/async", async function (req, res) {
  try {
    const getBooksAsync = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Books not found"));
          }
        }, 100);
      });
    };

    const booksData = await getBooksAsync();

    const axiosResponse = await axios.get("http://localhost:5000/", {
      timeout: 5000,
    });

    return res.status(200).json({
      message: "Books retrieved using async-await and Axios",
      books: booksData,
      axiosResponse: axiosResponse.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books",
      error: error.message,
    });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get("/async/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const getBookByIsbnAsync = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 100);
      });
    };

    const bookData = await getBookByIsbnAsync(isbn);

    const axiosResponse = await axios.get(
      `http://localhost:5000/isbn/${isbn}`,
      {
        timeout: 5000,
      }
    );

    return res.status(200).json({
      message: "Book details retrieved using async-await and Axios",
      book: bookData,
      axiosResponse: axiosResponse.data,
    });
  } catch (error) {
    if (error.message === "Book not found") {
      return res.status(404).json({
        message: "Book not found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Error retrieving book details",
        error: error.message,
      });
    }
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};

  const bookKeys = Object.keys(books);

  for (let key of bookKeys) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor[key] = books[key];
    }
  }

  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get book details based on author using Promise callbacks or async-await with Axios
public_users.get("/async/author/:author", async function (req, res) {
  try {
    const author = req.params.author;

    const getBooksByAuthorAsync = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByAuthor = {};
          const bookKeys = Object.keys(books);

          for (let key of bookKeys) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
              booksByAuthor[key] = books[key];
            }
          }

          if (Object.keys(booksByAuthor).length > 0) {
            resolve(booksByAuthor);
          } else {
            reject(new Error("No books found for this author"));
          }
        }, 100);
      });
    };

    const booksData = await getBooksByAuthorAsync(author);

    const axiosResponse = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`,
      {
        timeout: 5000,
      }
    );

    return res.status(200).json({
      message: "Books by author retrieved using async-await and Axios",
      books: booksData,
      axiosResponse: axiosResponse.data,
    });
  } catch (error) {
    if (error.message === "No books found for this author") {
      return res.status(404).json({
        message: "No books found for this author",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Error retrieving books by author",
        error: error.message,
      });
    }
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};

  const bookKeys = Object.keys(books);

  for (let key of bookKeys) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle[key] = books[key];
    }
  }

  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book details based on title using Promise callbacks or async-await with Axios
public_users.get("/async/title/:title", async function (req, res) {
  try {
    const title = req.params.title;

    const getBooksByTitleAsync = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByTitle = {};
          const bookKeys = Object.keys(books);

          for (let key of bookKeys) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
              booksByTitle[key] = books[key];
            }
          }

          if (Object.keys(booksByTitle).length > 0) {
            resolve(booksByTitle);
          } else {
            reject(new Error("No books found with this title"));
          }
        }, 100);
      });
    };

    const booksData = await getBooksByTitleAsync(title);

    const axiosResponse = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`,
      {
        timeout: 5000,
      }
    );

    return res.status(200).json({
      message: "Books by title retrieved using async-await and Axios",
      books: booksData,
      axiosResponse: axiosResponse.data,
    });
  } catch (error) {
    if (error.message === "No books found with this title") {
      return res.status(404).json({
        message: "No books found with this title",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Error retrieving books by title",
        error: error.message,
      });
    }
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
