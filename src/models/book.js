const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
});

const Book = mongoose.model('book', bookSchema);
module.exports = Book;
