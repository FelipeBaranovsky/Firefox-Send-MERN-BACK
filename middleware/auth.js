const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: 'vars.env' });

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(authHeader) {
        //Get the token
        const token = authHeader.split(' ')[1];

        //Verify the token
        try {
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user
        } catch (error) {
            console.log(error);
            res.status(401).json({msg: "Invalid token"});
        }
    }
    return next()
}