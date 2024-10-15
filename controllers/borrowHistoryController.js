const Book = require('./../models/bookModel');
const BorrowHistory = require('./../models/borrowHistoryModel');

exports.borrowBook = async (req, res) => {
    try {
        //Find the book
        const book = await Book.findById(req.params.id);

        if(!book || book.quantity === 0) {
            return res.status(500).json({
                status: 'fail',
                message: 'Oops! This book is not available'
            });
        }

        //Reduce the quantity of the book by 1 after borrowing
        book.quantity -= 1;
        await book.save();        

        //Create a borrow record
        const borrowed = await BorrowHistory.create({
            userId: req.user._id,
            bookId: req.params.id,
            issuedTimestamp: Date.now()
        });
        
        return res.status(200).json({
            status: 'success',
            data: {
                borrowed
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
};

exports.returnBook = async (req, res) => {
    try {
        //Check if the user has borrowed the book
        const borrowed = await BorrowHistory.findOne({userId: req.user.id, bookId: req.params.id});

        if(!borrowed) {
            return res.status(404).json({
                status: 'fail',
                message: 'Borrow record for this book and user not found'
            });
        }

        //Check the staus of the book
        if(borrowed.status === 'RETURNED') {
            return res.status(400).json({
                status: 'fail',
                message: 'Book is already returned'
            });
        }

        //Find the book
        const book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(500).json({
                status: 'fail',
                message: `Book with id ${req.params.id} does not exist`
            });
        }

        //Check for quantity overflow. Precautionary measure in case of some error or glitch
        if(book.maxQuantity && book.quantity + 1 > book.maxQuantity) {
            return res.status(500).json({
                status: 'fail',
                message: 'Book quantity overflow'
            });
        }
        
        //Increase the quantity of the book on returning
        book.quantity += 1;
        await book.save();  

        //Change the status of borrow record to RETURNED and set the return timestamp
        borrowed.status = 'RETURNED';
        borrowed.returnTimestamp = Date.now();
        await borrowed.save();

        return res.status(200).json({
            status: 'success',
            data: {
                borrowed
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
};

exports.getMyBookHistory = async (req, res) => {
    try {
        //Find the books borrowed by the user
        const borrows = await BorrowHistory.find({userId: req.user.id});

        if(!borrows || borrows.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'User has not borrowed any books'
            });
        }

        return res.render('myBooks', {
            results: borrows.length,
            borrows: borrows,
            loggedInUser: req.user
        });
        // return res.status(200).json({
        //     status: 'success',
        //     data: {
        //         borrows
        //     }
        // });
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}