var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}
function isLoggedIn(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({message: 'You must be logged in to vote.'});
    }
    next();
}

router.get('/', photoController.list);
//router.get('/publish', requiresLogin, photoController.publish);
router.get('/:id', photoController.show);

router.post('/:id/like',requiresLogin, photoController.like);

router.post('/:id/dislike',requiresLogin, photoController.dislike);

router.post('/', requiresLogin, upload.single('image'), photoController.create);

router.put('/:id', photoController.update);

router.delete('/:id', photoController.remove);

module.exports = router;
