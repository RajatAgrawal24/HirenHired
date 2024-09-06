const mongoose= require('mongoose')

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ProjectPact`)
        console.log(`\n MongoDb connected !! DB HOST :`)
    }
    catch(error){
        console.log("MONGODB connection error", error)
        process.exit(1)  
    }
}
module.exports=connectDB