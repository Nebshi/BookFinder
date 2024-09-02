const mongoose = require('mongoose');
const moment = require('moment');
const Book = require('../models/Book');
const logger = require('../utils/logger');

// GET all books with optional filters and pagination
const getBooks = async (req, res) => {
    try {
        // Extract query parameters
        const { title, author, genre, rating, publicationDate, page = 1, limit = 10 } = req.query;

        // Validate and sanitize page and limit
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (isNaN(pageNum) || pageNum < 1) {
            logger.warn('Invalid page number:', page);
            return res.status(400).json({ message: 'Invalid page number. It should be a positive integer.' });
        }

        if (isNaN(limitNum) || limitNum < 1) {
            logger.warn('Invalid limit number:', limit);
            return res.status(400).json({ message: 'Invalid limit number. It should be a positive integer.' });
        }

        // Build query object dynamically
        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' };
        if (author) query.author = { $regex: author, $options: 'i' };
        if (genre) query.genre = genre;
        if (rating) query.rating = rating;

        if (publicationDate) {
            if (!moment(publicationDate, 'YYYY-MM-DD', true).isValid()) {
                logger.warn('Invalid date format:', publicationDate);
                return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
            }

            const startOfDay = moment(publicationDate, 'YYYY-MM-DD').startOf('day').toDate();
            const endOfDay = moment(publicationDate, 'YYYY-MM-DD').endOf('day').toDate();

            query.publicationDate = { $gte: startOfDay, $lt: endOfDay };
        }

        // Total count for pagination
        const totalBooks = await Book.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalBooks / limitNum);

        // Check if requested page is greater than total pages
        if (pageNum > totalPages) {
            logger.warn('Requested page exceeds total pages:', { pageNum, totalPages });
            return res.status(400).json({ message: `Page number exceeds total pages. There are only ${totalPages} pages available.` });
        }

        // Pagination
        const skip = (pageNum - 1) * limitNum;
        const books = await Book.find(query).skip(skip).limit(limitNum);

        // Check if no books are found
        if (books.length === 0) {
            logger.info('No data available for filters:', query);
            return res.status(404).json({ message: 'No data available for the specified filters.' });
        }

        logger.info('Books fetched with filters:', { query, pagination: { pageNum, limitNum } });

        res.status(200).json({
            totalBooks,
            totalPages,
            currentPage: pageNum,
            books,
        });
    } catch (error) {
        logger.error('Error fetching books:', error);
        res.status(500).json({ message: error.message });
    }
};

// GET a single book by ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn('Invalid book ID format:', id);
            return res.status(400).json({ message: 'Invalid book ID format.' });
        }

        const book = await Book.findById(id);
        if (!book) {
            logger.info('Book not found:', id);
            return res.status(404).json({ message: 'Book not found.' });
        }

        logger.info('Fetched book by ID:', { id, book });
        res.status(200).json(book);
    } catch (error) {
        logger.error('Error fetching book:', error);
        res.status(500).json({ message: error.message });
    }
};

// POST create a new book
const createBook = async (req, res) => {
    try {
        const { title, author, genre, publicationDate, rating } = req.body;

        // Validate required fields
        if (!title || !author || !genre) {
            logger.warn('Required fields missing:', { title, author, genre });
            return res.status(400).json({ message: 'Title, author, and genre are required.' });
        }

        // Validate publicationDate format
        if (publicationDate && !moment(publicationDate, 'YYYY-MM-DD', true).isValid()) {
            logger.warn('Invalid date format:', publicationDate);
            return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
        }

        // Validate rating range
        if (rating !== undefined && (rating < 0 || rating > 5)) {
            logger.warn('Invalid rating value:', rating);
            return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
        }

        // Create and save the book
        const book = new Book({ title, author, genre, publicationDate, rating });
        await book.save();

        logger.info('Book created successfully:', { book });
        res.status(201).json(book);

    } catch (error) {
        logger.error('Error creating book:', error);
        res.status(500).json({ message: error.message });
    }
};

// PUT update an existing book by ID
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn('Invalid book ID format:', id);
            return res.status(400).json({ message: 'Invalid book ID format.' });
        }

        const bookExist = await Book.findById(id);
        if (!bookExist) {
            logger.info('Book not found:', id);
            return res.status(404).json({ message: 'Book not found.' });
        }

        const { title, author, genre, publicationDate, rating } = req.body;

        // Create an update object only with provided fields
        const updateFields = {};

        // Validate and add fields to updateFields object
        if (title) {
            if (typeof title !== 'string') {
                logger.warn('Invalid title type:', title);
                return res.status(400).json({ message: 'Title must be a string.' });
            }
            updateFields.title = title;
        }

        if (author) {
            if (typeof author !== 'string') {
                logger.warn('Invalid author type:', author);
                return res.status(400).json({ message: 'Author must be a string.' });
            }
            updateFields.author = author;
        }

        if (genre) {
            if (typeof genre !== 'string') {
                logger.warn('Invalid genre type:', genre);
                return res.status(400).json({ message: 'Genre must be a string.' });
            }
            updateFields.genre = genre;
        }

        if (publicationDate) {
            if (!moment(publicationDate, 'YYYY-MM-DD', true).isValid()) {
                logger.warn('Invalid date format:', publicationDate);
                return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
            }
            updateFields.publicationDate = new Date(publicationDate);
        }

        if (rating !== undefined) {
            if (typeof rating !== 'number' || rating < 0 || rating > 5) {
                logger.warn('Invalid rating value:', rating);
                return res.status(400).json({ message: 'Rating must be a number between 0 and 5.' });
            }
            updateFields.rating = rating;
        }

        // Check if there are fields to update
        if (Object.keys(updateFields).length === 0) {
            logger.warn('No fields provided for update:', req.body);
            return res.status(400).json({ message: 'At least one field must be provided for update.' });
        }

        // Perform the update
        const book = await Book.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

        if (!book) {
            logger.info('Book not found for update:', id);
            return res.status(404).json({ message: 'Book not found.' });
        }

        logger.info('Book updated successfully:', { id, updateFields, book });
        res.status(200).json(book);
    } catch (error) {
        logger.error('Error updating book:', error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE a book by ID
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn('Invalid book ID format:', id);
            return res.status(400).json({ message: 'Invalid book ID format.' });
        }

        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            logger.info('Book not found for deletion:', id);
            return res.status(404).json({ message: 'Book not found.' });
        }

        logger.info('Book deleted successfully:', { id });
        res.status(200).json({ message: 'Book deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting book:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};
