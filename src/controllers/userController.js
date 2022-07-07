const userModel = require("../models/userModel")

const isValidBody = function(body){
   return Object.keys(body).length > 0
}
const isValidTitle = function(title){
    return ["Mr","Mrs","Miss"].indexOf(title) !=-1

}

const createUser = async function(req,res){
    try{
        const data = req.body
        
        if(!isValidBody(data)){
            res.status(400).send({status:false , msg:"Please Provide some data for registation"})}

        const {title, name, phone , email, password, address} = data

        //--------------------------------------[required field]

        if(!title){return res.status(400).send({status:false, msg:"title field should not be empty"})}
        if(!name){return res.status(400).send({status:false, msg:"Name field is mandatory to be filled"})}
        if(!phone){return res.status(400).send({status:false, msg:"Phone No. is required"})}
        if(!email){return res.status(400).send({status:false, msg:"email is required"})}
        if(!password){return res.status(400).send({status:false, msg:"passowrd is required"})}


        //------------------------------------------[check validation]

        
        if(!isValidTitle(title)){ return res.status(400).send({status:false, msg:"title should be Mr, Mrs, or Miss"})}
        if(!(/^[A-Za-z]+$/).test(name)){return res.status(400).send({status:false, msg:"opps! name is not in proper format"})}
        if(!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)){return res.status(400).send({status:false, msg:"Opps! Phone No. is not is proper format"})}
      

        if(!email){
            res.status(400).send({status:false, msg:"email id is required"})
        }

        let Email = await userModel.findOne({email})
        if(Email) { return  res.status(400).send({ status:false, msg: email + " has already registered "})}

        let Password = await userModel.findOne({password})
        if(Password) { return res.status(400).send({status:false, msg:"Password should be unique"})}



        
        

        const userCreation = await  userModel.create(data)
         res.status(201).send({status:true, msg:"user created successfully", Data:userCreation})

         


    }catch(err){
    console.log("server error:" ,err.message)
    res.status(500).send({status:false, msg:err.message})

}}

module.exports = {createUser}