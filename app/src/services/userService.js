const multer = require("multer");
const path = require('path');
const pool = require('../database')

//#region config metodo para subida de archivos
var dir = path.join(__dirname, '../public/img/noticias-imagenes/')
const storage = multer.diskStorage({
    destination: dir,
    filename: function(req,file,cb){
        const fileName = file.originalname 
        cb(null,fileName);
    }
})
const upload = multer({
  storage:storage
}).array("newsImages",4)
//#endregion

const createUser = async(body) =>{
    try {
        const user = await pool.query("INSERT INTO usuarios(nombres, apellidos, enabled, username, password, id_rol)\
        VALUES(?,?,?,?,?,?)", [body.names, body.lasts, body.enabled, body.username, body.password, body.id_rol]
        )
        return user
    } catch (error) { throw { status: 500, error: error } }
}

const getUsers = async() =>{
    try {
        const users = await pool.query("SELECT id_usuario, username, nombres, apellidos FROM usuarios WHERE id_rol > 1")
        return await users
    } catch (error) { throw { status: 500, error: error } }
}

const getUserById = async(id) =>{
    try {
        const user = await pool.query("SELECT id_usuario, username, nombres, apellidos FROM usuarios WHERE id_usuario=?", [id])
        return await user
    } catch (error) { throw { status: 500, error: error } }
}

const updateUserById = async(body) =>{
    try {
        let data = await pool.query("UPDATE usuarios SET nombres=?, apellidos=?, username=? WHERE id_usuario=?", 
        [body.names, body.lasts, body.username, body.id])
        return await data
    } catch (error) { throw { status: 500, error: error } }
}

const deleteUserById = async(id) =>{
    try {
        await pool.query("DELETE FROM usuarios WHERE id_usuario =?", [id])
    } catch (error) { throw { status: 500, error: error } }
}

module.exports ={
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
}