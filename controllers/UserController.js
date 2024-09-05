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
        console.log("1st error")
        const {username,email,password,fullName,skills,portfolio, location }=req.body

        if(
            [username,email,password,fullName,location].some((field)=> field==null || field.trim()==="")
        ){
            return res.send({success:false})
        }
        if(!skills){
            return res.send({success:false})
        }
        if(!Array.isArray(skills)){
            skills =[skills]
        }
        if(skills.length===0){
            return res.send({success:false})
        }

        const existingUser= await Freelancer.findOne({
            $or:[{email},{username:username.toLowerCase()}]
        })
        if(existingUser){
            return res.send({success:false})
        }

        if(req.files==null || req.files.length===0){
            return res.send({success:false})
        }
        const avatarLocalPath=req.files?.avatar?.[0].path
        if(!avatarLocalPath){
            return res.send({success:false})
        }
        const avatar= await uploadOnCloudinary(avatarLocalPath)
        if(!avatar)
            {
                return res.send({success:false})
            }
            
            let cloudinaryArray = [];
            const certificateArray = req.files.certification || [];

            if (certificateArray.length !== 0) {
                const pathArray = certificateArray.map((file) => file.path).filter((path) => path != null);
                if (pathArray.length !== 0) {
                    cloudinaryArray = await Promise.all(pathArray.map(async (path) => await uploadOnCloudinary(path)));
                    cloudinaryArray = cloudinaryArray.filter((upload) => upload != null);
                }
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
           certification: cloudinaryArray.length===0? [] : cloudinaryArray
        })

        if(!registeredUser){
            return res.send({success:false})
        }

        return res.status(201).send({success:true,message:"Freelancer registered successfully"})

    }

    catch(err){
        console.log(err)
       
    }
}

static clientRegister= async(req,res,next)=>{
try{
    const {username,email,password,fullName,companyName, location }=req.body

    if(
        [username,email,password,fullName,location,companyName].some((field)=> field==null || field.trim()==="")
    ){
        console.log("Missing field")
        return res.send({success:false})
       
    }
    const existingUser= await Freelancer.findOne({
        $or:[{email},{username:username.toLowerCase()}]
    })
    if(existingUser){
        console.log("User already exists")
        return res.send({success:false})
       
    }
    if(req.file==null || Object.keys(req.file).length===0){
        console.log("Upload image")
        return res.send({success:false})
        
    }
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        console.log("Local Path does not exist")
        return res.send({success:false})
        
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
    if(!avatar)
        {
            console.log("Cannot upload on cloudinary")
            return res.send({success:false})
           
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
            return res.send({success:false})
            
        }

        return res.status(201).send({success:true,message:"Client registered successfully"})
        
}
catch(error){
    console.log(error)
       
}
}

static freelancerLogin= async(req,res,next)=>{
try{


const {email,username,password}=req.body

if(!email || !username)        
  {
    return res.send({success:false})
  }

const user=await Freelancer.findOne({
  $and: [{ username:username.toLowerCase() }, { email }], 
})

if(!user)
{
    return res.send({success:false})
}

if(!password){
    return res.send({success:false})
}
const isPasswordValid=await user.isPasswordCorrect(password);
if(!isPasswordValid){
    return res.send({success:false})
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
  200,
  {
    user:loggedUser,accessToken,refreshToken
  },
  "User logged in successfully"
)
}
catch(error){
    console.log(error)
    return res.send({success:false})
}
}
static clientLogin= async(req,res,next)=>{
    try{


        const {email,username,password}=req.body
        
        if(!email || !username)        
          {
            return res.send({success:false})
          }
        
        const user=await Client.findOne({
          $and: [{ username:username.toLowerCase() }, { email }], 
        })
        
        if(!user)
        {
            return res.send({success:false})
        }
        
        if(!password){
            return res.send({success:false})
        }
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            return res.send({success:false})
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
          200,
          {
            user:loggedUser,accessToken,refreshToken
          },
          "User logged in successfully"
        )
        }
        catch(error){
            console.log(error)
            return res.send({success:false})
        }
}

}
module.exports= UserController