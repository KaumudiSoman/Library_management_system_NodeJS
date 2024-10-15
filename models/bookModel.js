const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title of the book is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Name of the author is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description can not have more than 1000 characters']
    },
    thumbnail: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    maxQuantity: {
        type: Number,
        default: 0
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;