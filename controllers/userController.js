const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('viewUsers', {
            results: users.length,
            users: users,
            loggedInUser: req.user
        });
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         users
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

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            res.status(404).json({
                status: 'fail',
                message: `User with id ${req.params.id} not found`
            });
        }

        res.render('userDetails', {
            user: user,
            loggedInUser: req.user
        });
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         user
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

exports.updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!user) {
            res.status(404).json({
                status: 'fail',
                message: `User with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
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

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            res.status(404).json({
                status: 'fail',
                message: `User with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User record deleted successfully'
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};