const schema = require('../models/usuario.model');
const service = require('../services/usuario.service');
const hasher = require('../utils/bcrypt.utils');
const jwtCreator = require('../utils/jwt.utils');
//Creacion del usuario
const CreateUser = async (req, res)=>{
    try{
        let {error, value} = schema.validate(req.body);
        if(error){
            return res.status(400).send(error.message);
        }
        if(await service.FindUserByEmail(value.email)){
            return res.status(400).send("Usuario con el correo ya registrado");
        }
        value.password = await hasher.hashPassword(value.password); // Encriptacion de contraseña
        await service.CreateUser(value);
        return res.status(201).send("Usuario creado con exito");
    }catch(error){
        return res.status(500).send(error.message);
    }
};
//Encontrar a usuario por email
const FindUserByEmail = async(req,res)=>{
    try{
        const search = await service.FindUserByEmail(req.body.email);
        if(search){
            return res.status(200).send(search);
        }
        else{
            return res.status(404).send("Usuario no encontrado")
        }
    }catch(error){
        return res.status(500).send(error);
    }
}
//Login
const LoginUsuario = async(req,res,next) =>{
    try{
        const search = await service.FindUserByEmail(req.body.email);
        if(search){
            const compare = await hasher.checkPassword(req.body.password,search.password);
            if(compare){
                //Creacion del JWT y cookie de usuario
                const token = await jwtCreator.generateJWT({
                    userId:search._id,
                    userRole:search.role
                });
                res.cookie('token',token, {httpOnly: true, maxAge: 360000});
                req.role = search.role;
                next();
                return
            }
        }
        return res.status(400).send("Correo o contraseña incorrecta");
    }catch(error){
        console.error(error);
        return res.status(500).send(error);
    }
}
module.exports ={
    CreateUser,
    FindUserByEmail,
    LoginUsuario
};