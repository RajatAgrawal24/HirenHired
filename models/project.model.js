const mongoose= require('mongoose')
const projectSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    freelancer:{
        type:mongoose.Schema.ObjectId,
        ref:"Freelancer"
    },
    client:{
        type:mongoose.Schema.ObjectId,
        ref:"Client",
        required:true
    },
    rating:{
        type:Number,
        enum:[0,1,2,3,4,5],
        default:0
    },
    payment:{
        type:Number
    }


    
},{timestamps:true})

 const Project= new mongoose.model('Project',contactSchema) 

 module.exports= Contact