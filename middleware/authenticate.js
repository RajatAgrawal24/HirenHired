// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const Client = require('../models/client.model');
const Freelancer = require('../models/freelancer.model');

const authenticate = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        
        return res.redirect('/login'); // Or send an error response
    }

    try {
        const decoded = jwt.verify(token, 'process.env.ACCESS_TOKEN_SECRET');
        if(!decoded){
           
                return res.redirect('/login');
        }
        if (decoded.role === 'Client') {
            const client = await Client.findById(decoded._id);
            if (!client) {
                
                return res.redirect('/login');
            }
            req.user = client;
        } else if (decoded.role === 'Freelancer') {
            const freelancer = await Freelancer.findById(decoded._id);
            if (!freelancer) {
              
                return res.redirect('/login');
            }
            req.user = freelancer;
        }
        next();
    } catch (err) {
        console.error(err);
       
        return res.redirect('/login'); // Or send an error response
    }
};

module.exports = authenticate;
