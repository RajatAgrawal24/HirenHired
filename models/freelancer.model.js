const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')

const freelancerSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true
    },
    fullName:{
        type:String,
        required:[true,"fullname field is mandatory"]
        
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true,
    },
   
    avatar:{
        type:String,   
        required:true,
    },
    refreshToken:{    
        type:String
    },
    skills:[
        {
            type:String,
            required:true
        }
    ],
    portfolio:String,
    certification:
        {
            type:String
        }
    ,
    location:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"Freelancer"
    }
 
},{timestamps:true})

freelancerSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password,10)
    next()
})

freelancerSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
    // return true or false
}

freelancerSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

freelancerSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



 const Freelancer= new mongoose.model('Freelancer',freelancerSchema) 

 module.exports= Freelancer