class FrontController {
    static home = async (req, res) => {
        try{
            res.render('home',{user:null});
        }catch(err){
            console.log(err);
        }
    }

    static contact = async (req, res) => {
        try{
            res.render('contact',{user:null});
        }catch(err){
            console.log(err);
        }
    }

    static topicDetail = async (req, res) => {
        try{
            res.render('topicDetail');
        }catch(err){
            console.log(err);
        }
    }
    
    static signupLogin = async (req, res) => {
        try{
            res.render('signupLogin');
        }catch(err){
            console.log(err);
        }
    }
    
    static signupFreelancer = async (req, res) => {
        try{
            const error=req.query.error || null
            res.render('freelancerReg',{error: error});
        }catch(err){
            console.log(err);
        }
    }
    
    static signupClient = async (req, res) => {
        try{
            const error= req.query.error || null
            res.render('clientReg',{error:error});
        }catch(err){
            console.log(err);
        }
    }
    static loginFreelancer = async (req, res) => {
        try{
            const error= req.query.error || null
            res.render('login',{role:"Freelancer",error:error});
        }catch(err){
            console.log(err);
        }
    }
    static loginClient = async (req, res) => {
        try{
            const error= req.query.error || null
            res.render('login',{role:"Client",error:error});
        }catch(err){
            console.log(err);
        }
    }

    
   

}

module.exports = FrontController;