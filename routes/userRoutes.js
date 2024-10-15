const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').get(authController.signup).post(authController.signup);
router.route('/login').get(authController.login).post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/').get(authController.protect, authController.hasPermission('LIBRARIAN'), userController.getAllUsers);
router.route('/:id')
    .get(authController.protect, authController.hasPermission('LIBRARIAN'), userController.getUser)
    .patch(authController.protect, authController.hasPermission('LIBRARIAN'), userController.updateUser)
    .delete(authController.protect, authController.hasPermission('LIBRARIAN', 'MEMBER'), userController.deleteUser);

module.exports = router;