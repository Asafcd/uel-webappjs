const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region GETS
router.get('/borradores', async (req,res) =>{
    try {
        let data = await pool.query("SELECT * FROM noticias WHERE id_usuario=1 AND estado='Borrador'")
        //console.log(data)
        res.render('user/noticias.hbs',{data})
    } catch (error) {console.log(error)}    
})
router.get('/enviadas', async (req,res) =>{
    try {
        let data = await pool.query("SELECT * FROM noticias WHERE id_usuario=1 AND estado='Enviada'")
        //console.log(data)
        res.render('user/noticias.hbs',{data})
    } catch (error) {console.log(error)}
    
})
router.get('/aceptadas', async (req,res) =>{
    try {
        let data = await pool.query("SELECT * FROM noticias WHERE id_usuario=1 AND estado='Aceptada'")
        //console.log(data)
        res.render('user/noticias.hbs',{data})
    } catch (error) {console.log(error)}
    
})
//MENSAJES
router.get('/buzon', async (req,res) =>{
    //const {id_noticia} = req.params
    //let id = {id_noticia}
    try {
        let data = await pool.query("SELECT * FROM noticias WHERE id_usuario=1")
        let datamensajes = await pool.query("SELECT * FROM mensajes m JOIN noticias n WHERE m.id_noticia = n.id_noticia")   
        let mensajes = []
        data.forEach(e => {
            datamensajes.forEach( m=>{
                if(e.id_noticia==m.id_noticia){
                    mensajes.push({
                        id_mensaje: m.id_mensaje,
                        id_noticia: m.id_noticia,
                        contenido: m.contenido,
                        titulo: m.titulo
                    })
            }
            })            
        });  
        res.render('user/buzon.hbs', {mensajes})
    } catch (error) { console.log(error) }
})
router.get('/vermensaje/:id_mensaje', async (req,res) =>{
    const {id_mensaje} = req.params
    let mensaje = {id_mensaje}
    try {
        let data = await pool.query("SELECT * FROM mensajes WHERE id_mensaje=?",[mensaje.id_mensaje])
        let noticia = await pool.query("SELECT titulo, contenido, id_usuario FROM noticias WHERE id_noticia=?", [data[0].id_noticia])
        let autor = await pool.query("SELECT nombres, apellidos FROM usuarios WHERE id_usuario=?",[noticia[0].id_usuario])
        console.log(autor)
        res.render('user/vermensaje.hbs', {data:data[0], noticia:noticia[0], autor:autor[0]})  

        } catch (error) { console.log(error) }
})

router.get('/vernoticia/:id_noticia', async (req,res) =>{
    const {id_noticia} = req.params
    let id = {id_noticia}
    console.log(id)
    try {
        let data = await pool.query("SELECT * FROM noticias WHERE id_noticia=?",[id.id_noticia])
        let fuente = await pool.query("SELECT nombre, link FROM fuentes WHERE id_noticia=?",[id.id_noticia])
        let autor = await pool.query("SELECT id_usuario, nombres, apellidos FROM usuarios WHERE id_usuario=?",[data[0].id_usuario])
        console.log(fuente)
        res.render('user/vernoticia.hbs', {data:data[0], fuente, autor:autor[0]})
    } catch (error) { console.log(error) }
})

router.get('/crearnoticia', async (req,res) =>{
    try {
        let users = await pool.query("SELECT id_usuario, nombres, apellidos FROM usuarios")
        //console.log(users)
        res.render('user/crearnoticia.hbs', {users})
    } catch (error) { console.log(error) }
})

router.get('/editnoticia/:id_noticia', async (req,res) =>{
    const {id_noticia} = req.params
    let id = {id_noticia}
    try {
        let data = await pool.query("SELECT * FROM noticias WHERE id_noticia=?",[id.id_noticia])
        let users = await pool.query("SELECT id_usuario, nombres, apellidos FROM usuarios WHERE id_usuario=?",[data[0].id_usuario])
        console.log(users)
        res.render('user/crearnoticia.hbs', {users, data})
    } catch (error) { console.log(error) }
})
router.get('/deletenoticia/:id_noticia', async (req,res) =>{
    const {id_noticia} = req.params
    let id = {id_noticia}
    try {
        await pool.query("DELETE FROM noticias WHERE id_noticia=?",[id.id_noticia])
        res.redirect('/user/borradores')
    } catch (error) { console.log(error) }
})
router.get('/enviar/:id_noticia', async (req,res) =>{
    const {id_noticia} = req.params
    let id = {id_noticia}
    try {
        await pool.query("UPDATE noticias SET estado='Enviada' WHERE id_noticia=?",[id.id_noticia])
        res.redirect('/user/borradores')
    } catch (error) { console.log(error) }
})
//#endregion
//#region POSTS

/*router.post('/crearnoticia', async (req,res) =>{
    let {titulo, contenido, estado, etiqueta, autor, fuentenombre, fuentelink, mainimg, extraimg} = req.body
    let noticianew = {titulo, contenido, estado, etiqueta, autor, fuentenombre, fuentelink, mainimg, extraimg}
    
    res.send(noticianew)
})*/
//#endregion

module.exports = router;