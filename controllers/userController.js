const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newUser = async (req, res) => {

    //Validators
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    let user = await User.findOne({email});
    if(user) {
        return res.status(400).json({msg: 'User already exists'});
    }

    try {
        user = new User(req.body);

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.json({msg: "User created successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).send('There was an error');
    }
}