const Freelancer = require('../models/freelancer.model.js')
const Client = require('../models/client.model.js')
const uploadOnCloudinary= require('../utils/cloudinary.js')


const generateAccessAndRefreshTokenFreelancer=async(userId)=>{  
    try{
      const user=await Freelancer.findById(userId)
      const accessToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
  
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave: false})
      return {accessToken,refreshToken}
    }
    catch(error){
        return res.send({success:false})
    }
   }
const generateAccessAndRefreshTokenClient=async(userId)=>{  
    try{
      const user=await Client.findById(userId)
      const accessToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
  
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave: false})
      return {accessToken,refreshToken}
    }
    catch(error){
        return res.send({success:false})
    }
   }
  
class UserController{
static freelancerRegister= async(req,res,next)=>{
    try{
        
        let {username,email,password,fullName,skills,portfolio, location,certification }=req.body

        if(
            [username,email,password,fullName,location].some((field)=> field==null || field.trim()==="")
        ){
            return res.send({success:false,message:"Required fields empty"})
        }
        if(!skills){
            return res.send({success:false,message:"Skills not present"})
        }
        if(!Array.isArray(skills)){
            skills =[skills]
        }
        if(skills.length===0){
            return res.send({success:false,message:"Skills array is empty"})
        }

        const existingUser= await Freelancer.findOne({
            $or:[{email},{username:username.toLowerCase()}]
        })
        if(existingUser){
            return res.send({success:false,message:"User also exists"})
        }

        if(req.file==null || Object.keys(req.file).length===0){
            return res.send({success:false,message:"Avatar is mandatory"})
        }
        const avatarLocalPath=req.file?.path
        if(!avatarLocalPath){
            return res.send({success:false,message:"Local file path of avatar is absent"})
        }
        const avatar= await uploadOnCloudinary(avatarLocalPath)
        if(!avatar)
            {
                return res.send({success:false,message:"Avatar not uploaded in cloudinary"})
            }
    
        const registeredUser=await Freelancer.create({
           username: username.toLowerCase(),
           email,
           password,
           fullName,
           skills,
           location,
           portfolio:portfolio?.trim() || "", 
           avatar:avatar.url,
           certification: certification?.trim() || ""
        })

        if(!registeredUser){
            return res.send({success:false,message:"Freelancer not registered in database"})

        }

        return res.status(201).send({success:true,message:"Freelancer registered successfully"})

    }

    catch(err){
        console.log(err)
        return res.send({success:false,message:"Error while registering freelancer"})
}
}
static clientRegister= async(req,res,next)=>{
try{
    const {username,email,password,fullName,companyName, location }=req.body

    if(
        [username,email,password,fullName,location,companyName].some((field)=> field==null || field.trim()==="")
    ){
       
        
        return res.send({success:false,message:"Required fields empty"})
       
    }
    const existingUser= await Client.findOne({
        $or:[{email},{username:username.toLowerCase()}]
    })
    if(existingUser){
        
        return res.send({success:false,message:"User also exists"})
       
    }
    if(req.file==null || Object.keys(req.file).length===0){
        
        return res.send({success:false,message:"Avatar is mandatory"})
        
    }
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
     
        return res.send({success:false,message:"Local file path of avatar is absent"})
        
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
    if(!avatar)
        {
            return res.send({success:false,message:"Avatar not uploaded in cloudinary"})
           
        }

        const registeredUser=await Client.create({
            username:username.toLowerCase(),
            email,
            password,
            fullName,
            location, 
            avatar:avatar.url,
            companyName
          
        })

        if(!registeredUser){
            console.log("Error while storing in database")
            return res.send({success:false,message:"Client not registered in database"})
            
        }

        return res.status(201).send({success:true,message:"Client registered successfully"})
        
}
catch(error){
    console.log(error)
    return res.send({success:false,message:"Error while registering Client"})
}

       
}

static freelancerLogin= async(req,res,next)=>{
try{

const {email,username,password}=req.body

if(!email || !username)        
  {
    return res.send({success:false,message:"email and username are compulsory"})
  }

const user=await Freelancer.findOne({
  $and: [{ username:username.toLowerCase() }, { email }], 
})

if(!user)
{

     return res.send({success:false,message:"Freelancer not registered"})
}

if(!password){
    
    return res.send({success:false,message:"Password is mandatory"})
}
const isPasswordValid=await user.isPasswordCorrect(password);
if(!isPasswordValid){
    return res.send({success:false,message:"Password is incorrect"})

}

const {accessToken,refreshToken}=await generateAccessAndRefreshTokenFreelancer(user._id)


const loggedUser= await Freelancer.findById(user._id).select("-password -refreshToken")
const options={   
  httpOnly:true,
  secure:true         
}
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.send(
  {
    user:loggedUser,accessToken,refreshToken,message:"Freelancer logged in successfully"
  }
)
}
catch(error){

    return res.send({success:false,message:"Error while loggin in the freelancer"})
}
}
static clientLogin= async(req,res,next)=>{
    try{


        const {email,username,password}=req.body
        
        if(!email || !username)        
          {
            return res.send({success:false,message:"email and username are compulsory"})
          }
        
        const user=await Client.findOne({
          $and: [{ username:username.toLowerCase() }, { email }], 
        })
        
        if(!user)
        {
            return res.send({success:false,message:"Freelancer not registered"})
        }
        
        
        if(!password){
            return res.send({success:false,message:"Password is mandatory"})
        }
        
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            return res.send({success:false,message:"Password is incorrect"})
        }
        
        const {accessToken,refreshToken}=await generateAccessAndRefreshTokenClient(user._id)
        
        
        const loggedUser= await Client.findById(user._id).select("-password -refreshToken")
        const options={   
          httpOnly:true,
          secure:true         
        }
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .send(
         
          {
            user:loggedUser,accessToken,refreshToken,message:"Client logged in successfully"
          }
         
        )
        }
        catch(error){
           
            return res.send({success:false,message:"Error while loggin in the Client"})
        }
}

}
module.exports= UserController