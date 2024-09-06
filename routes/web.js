const express = require('express');
const router = express.Router();
const ContactController= require('../controllers/ContactController')
const UserController= require('../controllers/UserController')
const upload= require('../middleware/multer.js')

const FrontController = require('../controllers/FrontController');

const checkUserAuth = require('../middleware/auth');

const clientController = require('../controllers/ClientController');
// Middleware to authenticate and set req.user
const authenticate = require('../middleware/authenticate'); 

// Apply authentication middleware to all routes in this router
// router.use(authenticate);

router.get('/' , FrontController.home)
router.get('/contact' , FrontController.contact)
router.get('/topicDetail' , FrontController.topicDetail)
router.post('/contact/getInTouch',ContactController.getInTouch)
router.post('/register/freelancer',upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'certification', maxCount: 5 }]),UserController.freelancerRegister)
router.post('/register/client',upload.single("avatar"),UserController.clientRegister)
router.post('/login/freelancer',UserController.freelancerLogin)
router.post('/login/client',UserController.clientLogin)

// Dashboard page
router.get('/dashboard', clientController.getDashboardPage);

// API endpoints
router.get('/client/profile', clientController.getClientProfile);
router.get('/freelancers/nearby', clientController.getNearbyFreelancers);
router.post('/client/work', clientController.postWork);
router.get('/client/work', clientController.getClientWorks);

module.exports = router;