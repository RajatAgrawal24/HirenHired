const jwt = require('jsonwebtoken');

const checkUserAuth = async (req,res,next) => {
    // console.log('Hello Middleware');
    console.log(req.cookies)
    // const {accessToken} = req.cookies;
    // console.log(accessToken)

    try {
        // Verify token
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Read from env variable
        req.user = verified;  // Attach the decoded token (user info) to the request object
        next(); 
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
    // if(!token){
    //     req.flash('error', 'Unauthorised user please login')
    //     res.redirect('/')
    // }else{
    //     const verifyLogin = jwt.verify(token,'guptchabi@123456')
        // console.log(verifyLogin)
        // const data = await userModel.findOne({_id:verifyLogin.ID})
        // console.log(data)
        // if(!(data.isVerified==1)) {
        //     req.flash('error', 'Please Verify your Email First')
        //     res.redirect('/')
        // }else{
        //     req.userData = data
        //     next();
        // }
    // }
}

module.exports = checkUserAuth;