const Book = require('./../models/bookModel');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        // res.status(200).json({
        //     status: 'success',
        //     results: books.length,
        //     data: {
        //         books
        //     }
        // });
        res.render('viewBooks', {
            results: books.length,
            books: books,
            loggedInUser: req.user
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.createBook = async (req, res) => {
    try {
        const newBook = await Book.create({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            quantity: req.body.quantity,
        });
        return res.status(200).json({
            status: 'success',
            data: {
                newBook
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if(!book) {
            res.status(404).json({
                status: 'fail',
                message: `Book with id ${req.params.id} not found`
            });
        }

        res.render('bookDetails', {
            book: book,
            loggedInUser: req.user
        });
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         book
        //     }
        // });
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!book) {
            res.status(404).json({
                status: 'fail',
                message: `Book with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if(!book) {
            res.status(404).json({
                status: 'fail',
                message: `Book with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Book record deleted successfully'
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};