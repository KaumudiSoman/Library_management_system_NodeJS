const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const borrowHistoryRouter = require('./routes/borrowHistoryRoutes');
const authController = require('./controllers/authController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', authController.protect, (req, res) => {
    res.render('home', {
        loggedInUser: req.user
    });
});

app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/mybooks', borrowHistoryRouter);

app.all('*', (req, res) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: 'path not found'
    // });
    return res.render('pageNotFound');
});

module.exports = app;