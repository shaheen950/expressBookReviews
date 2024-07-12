const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
};
const getByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
      let isbnNum = parseInt(isbn);
      if (books[isbnNum]) {
          resolve(books[isbnNum]);
      } else {
          reject({ status: 404, message: `ISBN ${isbn} not found` });
      }
  });
};
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  // const TheBooks = books.find({})
  try{
  const book = await getBooks()
  res.send(book)
  }
  catch(err){
return res.status(300).json({message: "Yet to be implemented"});
  }
  
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try{
 const isbn = req.params.isbn
 const search = await books[isbn]
   res.send(search)
  }
  catch(err){
return res.status(300).json({message: "Yet to be implemented"});
  }
 
  // let filtered_users = books.filter((book) => book.email === email);
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try{
const author =  req.params.author;
  await getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));
  }
  catch(err){

  }
  
  // return res.status(300).json({message: "Yet to be implemented"});

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  try{
  const title = req.params.title
  await getBooks().then((boojEntries)=> Object.values(boojEntries))
  .then((books)=> books.filter((book)=> book.title===title)).then((filterbooks)=> res.send(filterbooks))
  }
  catch(err){
  return res.status(300).json({message: "Yet to be implemented"});
  }


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;
