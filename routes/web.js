const express = require('express');
const router = express.Router();
const ContactController= require('../controllers/ContactController')
const UserController= require('../controllers/UserController')
const upload= require('../middleware/multer.js')

const FrontController = require('../controllers/FrontController');

const checkUserAuth = require('../middleware/auth');

router.get('/' , FrontController.home)
router.get('/contact' , FrontController.contact)
router.get('/topicDetail' , FrontController.topicDetail)
router.post('/contact/getInTouch',ContactController.getInTouch)
router.post('/register/freelancer',upload.single('avatar'),UserController.freelancerRegister)
router.post('/register/client',upload.single("avatar"),UserController.clientRegister)
router.post('/login/freelancer',UserController.freelancerLogin)
router.post('/login/client',UserController.clientLogin)

module.exports = router;