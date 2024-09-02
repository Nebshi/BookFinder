const express = require('express');
const bookController = require('../controllers/book');
const router = express.Router();

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/books', bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);
module.exports = router;
