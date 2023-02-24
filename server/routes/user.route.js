
const express=require("express")
const {Usermodel}=require("../modals/user.modal")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")


const userrouter=express.Router()



//routes for sign up
userrouter.post("/register",async (req,res)=>{
const {f_name,l_name,email,confirm_email,pass,confirm_pass,security_question,security_answer}=req.body
const userexist=await Usermodel.findOne({email:email})
try{
    bcrypt.hash((pass,confirm_pass), 5, async (err, hash)=>{
      if(err)
      {
        res.send({"msg":"something went wrong","error":err.message})
      }  
    else{
      if(userexist)
      {
        res.send({"msg":"user already exist with this email"})
      }
      else{
      if(pass==confirm_pass && email==confirm_email)
      {
        const user=new Usermodel({f_name,l_name,email,confirm_email,pass:hash,confirm_pass:hash,security_question,security_answer})
        await user.save()
        res.send({"msg":"user registered"})
      }
      else if(email!==confirm_email)
      {
        res.send({"msg":"Unmatched Email"})
      }
      else{
        res.send({"msg":"Unmatched Password"})
      }
    }   
    }
});
}
catch(err)
{
    res.send({"msg":"something went wrong","error":err.message})
}
})






//login
userrouter.post("/login",async(req,res)=>{
  const {email,pass}=req.body
 try{
      const user=await Usermodel.find({email})
      if(user.length>0){
          console.log(user)
          bcrypt.compare(pass, user[0].pass, (err, result)=>{
             if(result)
             {
             let token=jwt.sign({backend:"javascript"}, 'aarti', { expiresIn: '1h' });
             res.send({"msg":"login success","token":token})
             }
             else{
              res.send({"msg":"wrong credentials"})
             }
          });
     
      }
      else{
          res.send({"msg":"wrong credentials"})
      }
  }
 catch(err){
  res.send({"msg":"something went wrong","error":err.message})
 }
})

//get all users
userrouter.get("/", async(req,res)=>{
  try{
      const notes=await Usermodel.find()
       res.send(notes)
  }

  catch(err){
      res.send({"msg":"cannot get the notes data", "error":err.message})
}
})



module.exports={
  userrouter
}






