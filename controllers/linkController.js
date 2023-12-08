const Links = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next) => {
    // Check for errors
    //Validators
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Create a new link
    const { name_original, name } = req.body;
    const link = new Links();
    link.url = shortid.generate();
    link.name = name;
    link.name_original = name_original;

    // Auth User
    if(req.user){
        const { password, downloads } = req.body;

        if(downloads) {
            link.downloads = downloads;
        }
        if(password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }

        link.author = req.user.id;
    }

    // Store the current link
    try {
        await link.save();
        return res.json({msg: `${link.url}`});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}

// Get all links
exports.allLinks = async (req, res) => {
    try {
        const links = await Links.find({}).select('url -_id');
        res.json({links});
    } catch (error) {
        console.log(error);
    }
}

exports.getLink = async (req, res, next) => {
    
    //Verify existing link
    const {url} = req.params
    const link = await Links.findOne({ url });
   
    if (link) {
        res.json({file: link.name, password: false});
    }
    next();
    

}

exports.existsPassword = async (req, res, next) => {
    const {url} = req.params
    const link = await Links.findOne({ url });
   
    if(!link) {
        res.status(404).json({msg: "Link does not exist"});
        return next();
    }

    if(link.password) {
        return res.json({password: true, link: link.url});
    }
    return next();

}

exports.verifyPassword = async (req, res, next) => {
    const {url} = req.params
    const {password} = req.body
    // Check url is valid
    const link = await Links.findOne({ url });
    if(!link) {
        res.status(404).json({msg: "Link does not exist"});
        return next();
    }
    // Verify password

    if(bcrypt.compareSync(password, link.password)) {
        // Allow download
        next();
    } else {
        return res.status(401).json({msg: "Incorrect password"});
    }

}