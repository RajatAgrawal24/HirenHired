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
    catch(err){
        console.log(err.message)
        res.redirect(`/login/freelancer?error=${err.message}`)
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
    catch(err){
        console.log(err.message)
        res.redirect(`/login/freelancer?error=${err.message}`)
    }
   }
  
class UserController{
static freelancerRegister= async(req,res,next)=>{
    try{
        
        let {username,email,password,fullName,skills,portfolio, location,certification }=req.body

        if(
            [username,email,password,fullName,location].some((field)=> field==null || field.trim()==="")
        ){
            throw new Error("Required fields empty")
        }
        if(!skills){
            throw new Error("Skills field is empty")
        }
        if(!Array.isArray(skills)){
            skills =[skills]
        }
        if(skills.length===0){
            throw new Error("No skill specified")
        }

        const existingUser= await Freelancer.findOne({
            $or:[{email},{username:username.toLowerCase()}]
        })
        if(existingUser){
            throw new Error("Freelancer with specified email or username already exists")
        }

        if(req.file==null || Object.keys(req.file).length===0){
            throw new Error("Avatar is required")
        }
        const avatarLocalPath=req.file?.path
        if(!avatarLocalPath){
            throw new Error("Avatar is required")
        }
        const avatar= await uploadOnCloudinary(avatarLocalPath)
        if(!avatar)
            {
                throw new Error("Avtar could not be uploaded, upload again")
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
            throw new Error("Could not register")

        }

        res.redirect('/login/freelancer')
    }

    catch(err){
        console.log(err)
         res.redirect(`/signup/freelancer?error=${err.message}`)
}
}
static clientRegister= async(req,res,next)=>{
try{
    const {username,email,password,fullName,companyName, location }=req.body

    if(
        [username,email,password,fullName,location,companyName].some((field)=> field==null || field.trim()==="")
    ){
       
        
        throw new Error("Required fields empty")
       
    }
    const existingUser= await Client.findOne({
        $or:[{email},{username:username.toLowerCase()}]
    })
    if(existingUser){
        
        throw new Error("Client with specified email or username already exists")
       
    }
    if(req.file==null || Object.keys(req.file).length===0){
        
        throw new Error("Avatar is required")
        
    }
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
     
        throw new Error("Avtar could not be uploaded, upload again")
        
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
    if(!avatar)
        {
            throw new Error("Avtar could not be uploaded, upload again")
           
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
            throw new Error("Could not register")
            
        }

        res.redirect('/login/client')
        
}
catch(err){
    console.log(err)
    res.redirect(`/signup/client?error=${err.message}`)
}

       
}

static freelancerLogin= async(req,res,next)=>{
try{

const {email,username,password}=req.body

if(!email || !username || email.trim()==="" || username.trim()==="")        
  {
    throw new Error("Email and username are mandatory")
  }

const user=await Freelancer.findOne({
  $and: [{ username:username.toLowerCase() }, { email }], 
})

if(!user)
{
    throw new Error("You are not registered")
     
}

if(!password || password.trim()===""){
    
    throw new Error("Password field is required")
}
const isPasswordValid=await user.isPasswordCorrect(password);
if(!isPasswordValid){
    throw new Error("Password is incorrect")

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
.redirect('/dashboard/freelancer')
}
catch(err){

    console.log(err.message)
    if(err.message==="Password field is required" || err.message==="Email and username are mandatory"){
    res.redirect(`/login/freelancer?error=${err.message}`)
}
    else if(err.message==="Password is incorrect" || err.message==="You are not registered"){
    res.redirect(`/signup/freelancer?error=${err.message}`)
}
}
}
static clientLogin= async(req,res,next)=>{
    try{


        const {email,username,password}=req.body
        
        if(!email || !username)        
          {
            throw new Error("Email and username are mandatory")
          }
        
        const user=await Client.findOne({
          $and: [{ username:username.toLowerCase() }, { email }], 
        })
        
        if(!user)
        {
            throw new Error("You are not registered")
        }
        
        
        if(!password){
            throw new Error("Password field is required")
        }
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new Error("Password is incorrect")
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
        .redirect('/dashboard/client')
        
        }
        catch(err){
            console.log(err.message)
            if(err.message==="Password field is required" || err.message==="Email and username are mandatory"){
             res.redirect(`/login/client?error=${err.message}`)
        }
            else if(err.message==="Password is incorrect" || err.message==="You are not registered"){
                res.redirect(`/signup/client?error=${err.message}`)
        }
            
        }
}
static getDashboardPage= async(req,res,next)=>{
    try{
        res.render('freelancerDashboard')
    }
    catch(err){
        console.log(err)
    }
}

}
module.exports= UserController