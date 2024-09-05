const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')
const clientSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    fullName:{
        type:String,
        required:[true,"fullname field is mandatory"],
        trim:true,
        index:true  
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
    companyName:{
        type:String,
        required:true,
        default:"Independent"
    },
    location:{
        type:String,
        required:true
    }
},{timestamps:true})

clientSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password,10)
    next()
})

clientSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
    // return true or false
}

clientSchema.methods.generateAccessToken= function(){
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

clientSchema.methods.generateRefreshToken= function(){
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



 const Client= new mongoose.model('Client',clientSchema) 

 module.exports= Client