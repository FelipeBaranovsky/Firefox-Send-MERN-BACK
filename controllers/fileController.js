const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Links = require('../models/Link');

exports.uploadFile = async (req, res) => {
    const config = {
        limits: { fileSize: req.user ? 1024*1024*10 : 1024*1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }

    const upload = multer(config).single('file')

    upload(req, res, async (err) => {
        if(!err) {
            res.json({file: req.file.filename});
        } else {
            console.log(err);
            return next();
        }
    })
}

exports.deleteFile = async (req, res, next) => {
    if(!req.file) {
        return next();
    }
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
    } catch (error) {
        console.log(error);
    }
}

exports.download = async (req, res, next) => {

    //Get link
    const {file} = req.params
    
    const link = await Links.findOne({ name: file });

    const downloadFile = __dirname + '/../uploads/' + file;
    //Change downloadFile name to name_original from the link.name_original
    
    
    res.download(downloadFile, link.name_original);

    //Deletete the file and remove it from the db
    const {downloads, name} = link
    // 1 Download left
    
    if (downloads === 1) {
        //Delete the file
        req.file = name;
        //Delete the entry from the DB
        await Links.findOneAndDelete( link._id );

        next();
    } else {
        //If downloads > 1, subtract 1
        link.downloads--;
        await link.save();
    }

}