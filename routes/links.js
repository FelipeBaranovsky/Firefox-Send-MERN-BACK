const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const fileController = require('../controllers/fileController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/', 
    [
        check('name_original', 'Upload a file').not().isEmpty()
    ],
    auth,
    linkController.newLink
)

router.get('/',
    linkController.allLinks
);

router.get('/:url',
    linkController.existsPassword,
    linkController.getLink,
);

router.post('/:url',
    linkController.verifyPassword,
    linkController.getLink,
);

module.exports = router;