const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/', 
    [
        check('email', 'Email must have a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ],
    authController.authUser
)
router.get('/',
    [
        check('email', 'Email must have a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ],
    auth,
    authController.authenticatedUser
);

module.exports = router;