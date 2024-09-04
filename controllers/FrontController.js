class FrontController {
    static home = async (req, res) => {
        try{
            res.render('home');
        }catch(err){
            console.log(err);
        }
    }

    static contact = async (req, res) => {
        try{
            res.render('contact');
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
}

module.exports = FrontController;