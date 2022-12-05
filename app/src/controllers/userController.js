const userService = require('../services/userService')
const { dateFormat } = require("../lib/helpers");
const { encryptPW } = require("../lib/helpers")

const createUser = async(req,res) =>{
    const body = req.body
    const pwEncrypted = await encryptPW(body.password)
    try {
        const user = {
            names : body.names,
            lasts: body.lasts,
            enabled: 1,
            username: body.username,
            password: pwEncrypted,
            id_rol: 2
        }
        const newUser = await userService.createUser(user)
        let tag = "Usuario creado: "+ newUser.username
        res.status(200).redirect('/admin/users/')
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}

}

const getUsers = async(req,res) => {
    let tag = "Usuarios"
    try {
        const users = await userService.getUsers()
        res.status(200).render('admin/users.hbs', {data:users, tag:tag})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const getUserById = async(req,res) => {
    const {id} = req.params
    let tag = "Editar Usuario"
    try {
        const user = await userService.getUserById(id)
        res.status(200).render('admin/edituser.hbs', {data:user[0], tag:tag})
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const updateUserById = async(req,res) => {
    const {id} = req.params
    const {names, lasts, username} = req.body
    const user = {names, lasts, username, id}
    try {
        const data = await userService.updateUserById(user)
        res.status(200).redirect('/admin/users/')
    } catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

const deleteUserById = async(req, res) =>{
    const {id} = req.params
    try{
        //const user = await userService.getUserById(id)
        await userService.deleteUserById(id)
        res.status(200).redirect('/admin/users/')
    }catch(err){res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });}
}

module.exports ={
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
}