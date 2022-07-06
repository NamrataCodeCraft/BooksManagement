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
        const {title, name, phone , email, password, address} = data

        if(!isValidBody(data)){
            res.status(400).send({status:false , msg:"Please Provide some data for registation"})}

        if(!(/^[A-Za-z]+$/).test(name)){return res.status(400).send({status:false, msg:"opps! name is not in proper format"})}
        
        if(!title){return res.status(400).send({status:false, msg:"title field should not be empty"})}

        if(!isValidTitle(title)){ return res.status(400).send({status:false, msg:"title should be Mr, Mrs, or Miss"})}

        let Email = await userModel.findOne({email})
        if(Email) { return  res.status(400).send({ status:false, msg: email + " has already registered "})}

        let Password = await userModel.findOne({password})
        if(Password) { return res.status(400).send({status:false, msg:"Password should be unique"})}



        
        

         const userCreation = await  userModel.create(data)
         res.status(201).send({status:true, msg:"user created successfully", Data:userCreation})

         


    }
}
