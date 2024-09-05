const mongoose= require('mongoose')

const freelancerSchema= new mongoose.Schema(
    {
        company:{
            type:String,
            required:true,
            unique:true
        },
        years:{
            type:Number,
            required:true
        }
    }
)
const FreelancerSchema= new mongoose.Schema({
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
    skills:[
        {
            type:String,
            required:true
        }
    ],
    portfolio:String,

    experience:[
        experienceSchema
    ],
    location:{
        type:String,
        required:true
    }
 
},{timestamps:true})

 const Freelancer= new mongoose.model('Freelancer',contactSchema) 

 module.exports= Contact