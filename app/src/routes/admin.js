const express = require('express')
const router = express.Router();
const pool = require('../database')
const aut = require('../lib/auth')
const helpers = require('../lib/helpers')
//#region GET x recibidas, acept, rechaz
router.get('/recibidas', aut.isAdmin, async (req,res)=>{
    let tag = "Recibidas"
    try{
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado FROM noticias n\
        JOIN usuarios u WHERE estado='Enviada' AND n.id_usuario = u.id_usuario")        
        res.render('admin/noticiasadmin.hbs', {data,tag})
    }catch(err){console.log(err)}
})
router.get('/aceptadas', aut.isAdmin, async (req,res)=>{
    let tag = "Aceptadas"
    try{
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado FROM noticias n\
        JOIN usuarios u WHERE estado='Aceptada' AND n.id_usuario = u.id_usuario")
        res.render('admin/noticiasadmin.hbs', {data,tag})
    }catch(err){console.log(err)}
})
router.get('/rechazadas', aut.isAdmin, async (req,res)=>{
    let tag = "Rechazadas"
    try{
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado, m.contenido as mensaje FROM noticias n\
        JOIN usuarios u JOIN mensajes m WHERE n.estado='Rechazada' AND n.id_usuario = u.id_usuario AND n.id_noticia = m.id_noticia")
        res.render('admin/noticiasrechazadas.hbs', {data, tag})
    }catch(err){console.log(err)}
})
//#endregion

router.get('/vernoticia/:id_noticia', aut.isAdmin, async (req,res)=>{
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

router.get('/aceptarnoticia/:id_noticia', aut.isAdmin, async (req,res)=>{
    let {id_noticia} = req.params
    let noti = {id_noticia}
    try{
        await pool.query("UPDATE noticias SET estado='Aceptada' WHERE id_noticia=?", [noti.id_noticia])
        res.redirect('/admin/recibidas')
    }catch(err){console.log(err)}
})
router.get('/rechazarnoticia/:id_noticia', aut.isAdmin, async (req,res)=>{
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
router.get('/users', aut.isAdmin, async (req,res)=>{
    let tag = "Usuarios"
    try{
        let data = await pool.query("SELECT id_usuario, username, nombres, apellidos FROM usuarios WHERE id_rol > 1")        
        res.render('admin/users.hbs', {data,tag})
    }catch(err){console.log(err)}
})
router.get('/edituser/:id', aut.isAdmin, async (req, res) =>{
    let {id} = req.params
    let user = {id}
    try {
        let data = await pool.query("SELECT id_usuario, nombres, apellidos, username FROM usuarios WHERE id_usuario = ?", [user.id])
        res.render('admin/edituser.hbs', {data:data[0]})
    } catch (e) { console.log(e) }
})
router.get('/removeuser/:id', aut.isAdmin, async (req, res) =>{
    let {id} = req.params
    let user = {id}
    try {
        await pool.query("DELETE FROM usuarios WHERE id_usuario =?", [user.id])
        res.redirect('back')
    } catch (e) { console.log(e) }
})
router.get('/signup', aut.isAdmin, (req, res) =>{
    res.render('admin/signup.hbs')
})

router.post('/signup', async (req, res) =>{
    const {names, lasts, username, password} = req.body
    const nwuser = { names, lasts, username, password };
    nwuser.password = await helpers.encryptPW(password)
    try{
        const data = await pool.query("INSERT INTO usuarios(nombres, apellidos, enabled, username, password, id_rol) VALUES(?,?,1,?,?,2)",
        [nwuser.names, nwuser.lasts, nwuser.username, nwuser.password])
        nwuser.id = data.insertId
        nwuser.id_rol = 2
        
        req.flash("success","Usuario creado con exito")
        res.redirect('/admin/users')
    }catch(e){console.log(e)}
})

module.exports = router;