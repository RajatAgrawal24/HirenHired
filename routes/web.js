const express = require('express');
const router = express.Router();
const ContactController= require('../controllers/ContactController')

const FrontController = require('../controllers/FrontController');

const checkUserAuth = require('../middleware/auth');

router.get('/' , FrontController.home)
router.get('/contact' , FrontController.contact)
router.get('/topicDetail' , FrontController.topicDetail)
router.post('/contact/getInTouch',ContactController.getInTouch)

module.exports = router;