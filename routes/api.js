const {Router} = require('express');
const router = Router();
const path = require('path');

// form-data
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// upload file
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+ '.' + extension)
    }
})

const upload = multer({ storage: storage });

const userController = require('../controllers/UsersController');
const photosController = require('../controllers/PhotosController');

router.get('/', async (req, res) => {
    res.send(await userController.viewUsers())
});

router.post('/signup', multipartMiddleware, (req, res) => {
    userController.createUser(req.body, res);
});

router.post('/login', multipartMiddleware, (req, res) => {
    userController.loginUser(req.body, res);
})

router.post('/logout', (req, res) => {
    userController.logoutUser(req, res);
})

router.get('/photo', multipartMiddleware,(req, res) => {
    photosController.viewsPhoto(req, res)
});

router.get('/photo/:id', multipartMiddleware,(req, res) => {
   photosController.indexPhoto(req, res)
});

router.post('/photo', upload.single('photo'),  (req, res) =>  {
    photosController.uploadPhoto(req, res)
});

router.delete('/photo/:id',  (req, res) =>  {
    photosController.deletePhoto(req, res)
});



module.exports = router;