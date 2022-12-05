const express = require('express')
const router = express.Router();
const pool = require('../database')
const aut = require('../lib/auth')
const helpers = require('../lib/helpers')
const userController = require('../controllers/userController')
const newsController = require('../controllers/newsController')
//#region GET x status
router.get('/news/0', aut.isAdmin, async (req,res)=>{
    let tag = "Recibidas"
    try{
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado FROM noticias n\
        JOIN usuarios u WHERE estado='Enviada' AND n.id_usuario = u.id_usuario")        
        res.render('admin/noticiasadmin.hbs', {data,tag})
    }catch(err){console.log(err)}
})
router.get('/news/1', aut.isAdmin, async (req,res)=>{
    let tag = "Aceptadas"
    try{
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado FROM noticias n\
        JOIN usuarios u WHERE estado='Aceptada' AND n.id_usuario = u.id_usuario")
        res.render('admin/noticiasadmin.hbs', {data,tag})
    }catch(err){console.log(err)}
})
router.get('/news/2', aut.isAdmin, async (req,res)=>{
    let tag = "Rechazadas"
    try{
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado, m.contenido as mensaje FROM noticias n\
        JOIN usuarios u JOIN mensajes m WHERE n.estado='Rechazada' AND n.id_usuario = u.id_usuario AND n.id_noticia = m.id_noticia")
        res.render('admin/noticiasrechazadas.hbs', {data, tag})
    }catch(err){console.log(err)}
})
//#endregion

router.get('/news/:id_noticia', aut.isAdmin, async (req,res)=>{
    let {id_noticia} = req.params
    let noti = {id_noticia}
    try{
        let data = await pool.query("SELECT * FROM noticias WHERE id_noticia=?", [ noti.id_noticia ]);    
        let fuente = await pool.query("SELECT nombre, link FROM fuentes WHERE id_fuente=?", [data[0].id_fuente] );
        let user = await pool.query("SELECT id_usuario, nombres, apellidos FROM usuarios WHERE id_usuario=?", [data[0].id_usuario]
    );
        res.render('admin/vistanoticia.hbs', {data:data[0], autor:user[0], fuente:fuente[0]})
    }catch(err){console.log(err)}
})

router.put('/news/:id_noticia', aut.isAdmin, async (req,res)=>{
    let {id_noticia} = req.params
    let noti = {id_noticia}
    try{
        await pool.query("UPDATE noticias SET estado='Aceptada' WHERE id_noticia=?", [noti.id_noticia])
        res.redirect('/admin/recibidas')
    }catch(err){console.log(err)}
})
router.put('/news/:id_noticia', aut.isAdmin, async (req,res)=>{
    let {id_noticia} = req.params
    let noti = {id_noticia}
    try{
        await pool.query("UPDATE noticias SET estado='Rechazada' WHERE id_noticia=?", [noti.id_noticia])
        res.redirect('/admin/mensaje/'+noti.id_noticia)
    }catch(err){console.log(err)}
})
router.get('/mensaje/:id_noticia', aut.isAdmin, async (req,res)=>{
    let {id_noticia} = req.params
    let noti = {id_noticia}
    try{
        let data = await pool.query("SELECT id_noticia, titulo FROM noticias WHERE id_noticia=?", [noti.id_noticia])
        res.render('admin/mensaje.hbs', {data:data[0]})
    }catch(err){console.log(err)}
})
router.post('/mensaje/:id_noticia', async (req,res)=>{
    let {id_noticia} = req.params
    let noti = {id_noticia}
    let {contenido} = req.body
    let msj = {contenido}
    try{
        await pool.query("INSERT INTO mensajes(id_noticia, contenido) VALUE(?,?)", [noti.id_noticia, msj.contenido])
        res.redirect('/admin/rechazadas')
    }catch(err){console.log(err)}
})

//#region Gestion de usuarios
router.get('/users', aut.isAdmin, userController.getUsers)
router.get('/users/:id', aut.isAdmin, userController.getUserById)
router.post('/users/:id', aut.isAdmin, userController.updateUserById)
router.get('/usersR/:id', aut.isAdmin, userController.deleteUserById)
router.get('/signup', aut.isAdmin, (req, res) =>{
    res.render('admin/signup.hbs')
})
router.post('/signup', aut.isAdmin, userController.createUser )
//#endregion
module.exports = router;