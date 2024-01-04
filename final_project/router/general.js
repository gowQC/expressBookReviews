const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;    
    const book=books[isbn];
    if(book){
        res.json(book);
    }
    else{
        res.status(404).json({"message":"Books not found"});
    }
 });
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author=req.params.author;
    for(let i=1;i<=10;i++){
        if (books[i].author===author) {        
            res.send(books[i]);
        }  
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title=req.params.title;
    for(let i=1;i<=10;i++){
        if (books[i].title===title) {
            res.json(books[i])
        }
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    const book=books[isbn];
    if(book){
        res.json(book.reviews);
    }
    else{
        res.json({message:`Book with the isbn ${isbn} not found`});
    }
});

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;

    if(username && password){
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message:`User ${username} registered`});
        }
        else{
            return res.status(400).json({message:`User ${username} already registered`});
        }
    }
    else{
        return res.status(404).json({message: "Must provide username and password"});
    }
});

// Task 10: Get all books with Promise callbacks
const listBooks = async () => {
	try{
		const getBooks = await Promise.resolve (books)
		if (getBooks) {
			return getBooks
		} else {
			return Promise.reject (new error('Books not found'))
		}
	} catch (error) {
		console.log (error)
	}
}

public_users.get('/',async (req, res)=> {
    const listBook = await listBooks()
    res.json (listBook)
});

// Task 11: Get books based on ISBN with Promise callbacks
const getByISBN=async(isbn)=>{
    try{
        const getISBN=await Promise.resolve(isbn);
        if(getISBN){
            return Promise.resolve(isbn)
        }
        else{
            return Promise.reject(new error("Book with the isbn not found!"));
        }
    }
    catch(error){
        console.log(error);
    }
}

public_users.get('/isbn/:isbn',async(req,res)=>{
    const isbn=req.params.isbn;
    const returnedIsbn=await getByISBN(isbn);
    res.send(books[returnedIsbn]);
})

// Task 12: Get books based on author with Promise callbacks
const getByAuthor=async(author)=>{
    try{
        if(author){
            const authBook=[];
            Object.values(books).map((book)=>{
                if(book.author===author){
                    authBook.push(book);
                }
            })
            return Promise.resolve(authBook);
        }
        else{
            return Promise.reject(new error("Book with the author name not found!!!"));
        }
    }
    catch(error){
        console.log(error);
    }
}

public_users.get('/author/:author',async(req,res)=>{
        const author=req.params.author;
        const data=await getByAuthor(author);
        res.send(data);
})

// Task 13: Get books based on title with Promise callbacks
const getByTitle=async(title)=>{
    try{
        if(title){
            const titleBook=[];
            Object.values(books).map((book)=>{
            if(book.title===title){
                titleBook.push(book);
            }
        })
            return Promise.resolve(titleBook);
        }
        else{
            return Promise.reject(new error("Book with the author name not found!!!"));
        }
        
    }
    catch(error){
        console.log(error);
    }
}


public_users.get('/title/:title',async(req,res)=>{
    const title=req.params.title;
    const data=await getByAuthor(title);
    res.send(data);
})

module.exports.general = public_users;
