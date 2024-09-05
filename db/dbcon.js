const mongoose= require('mongoose')
const localUrl = 'mongodb://127.0.0.1:27017/admission'

const connectDB = async () => {
    try{
        // const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ProjectPact`)
        const connectionInstance = await mongoose.connect(localUrl)
        console.log(`MongoDb connected !! DB HOST :`)
        
    }
    catch(error){
        console.log("MONGODB connection error", error)
        process.exit(1)  
    }
}
module.exports=connectDB