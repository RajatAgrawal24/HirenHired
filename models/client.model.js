const mongoose= require('mongoose')
const ClientSchema= new mongoose.Schema({
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

 const Client= new mongoose.model('Client',contactSchema) 

 module.exports= Contact