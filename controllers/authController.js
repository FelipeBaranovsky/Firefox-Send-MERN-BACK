const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: 'vars.env' });

exports.authUser = async (req, res, next) => {
    //Validators
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    
    //Find the user
    const {email, password} = req.body;
    const user = await User.findOne({email: email});

    if(!user) {
        res.status(401).json({msg: "User does not exist"});
        return next();
    }

    //Verify password and authorization
    if(bcrypt.compareSync(password, user.password)) {
        //Create JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: '8h'
        });

        res.status(200).json({token: token});

    } else {
        res.status(401).json({msg: "Incorrect password"});
        return next();
    }

}

exports.authenticatedUser = async (req, res, next) => {
    res.json({user: req.user});
    return next();
}