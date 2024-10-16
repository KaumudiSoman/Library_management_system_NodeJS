const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');

const signInToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = async (req, res) => {
    if(req.method === 'GET') {
        return res.render('signupForm');
    }

    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
    
        const token = signInToken(newUser._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
        });
    
        return res.redirect('/');
        // res.status(201).json({
        //     status: 'success',
        //     token,
        //     data: {
        //         newUser
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

exports.login = async (req, res) => {
    if(req.method === 'GET') {
        return res.render('loginForm');
    }

    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password'
        });
    }

    const token = signInToken(user._id);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    });

    return res.redirect('/');
    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
};

exports.protect = async (req, res, next) => {
    //Check if the token is present in header and get the token
    let token;
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1];
    // }

    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if(!token) {
        return res.redirect('/api/users/login');
        // return res.status(401).json({
        //     status: 'fail',
        //     message: 'Please log in to get access'
        // });
    }

    //Decode the token to get the user id
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    //Find user based on decoded id
    const user = await User.findById(decoded.id);

    if(!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'User associated with this token no longer exists'
        });
    }

    //If authorization is successful
    req.user = user;
    next();
};

exports.hasPermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire immediately
        secure: process.env.NODE_ENV === 'production'
    });

    res.redirect('/api/users/login');
};