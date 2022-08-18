const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region Router categories GETS
router.get('/:id', async (req,res)=>{
    let {id} = req.params
    let etiq = {id}
    try {
        let tagval = await pool.query("SELECT * FROM etiquetas WHERE id=?",[etiq.id])
        let tagname = await tagval[0].nombre.toUpperCase()
        tagval[0].nombre = tagname
        let tag = await pool.query("SELECT * FROM etiquetas")
        let data = await pool.query(
            "SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link \
            FROM noticias n JOIN usuarios u JOIN fuentes f \
            WHERE n.etiqueta=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente         \
            ORDER BY n.id_noticia DESC", [etiq.id]) //AND n.estado='Aceptada'
        //let fuentes = await poo
        //console.log(data[0])
        res.render('noticias/templateSeccion.hbs',{data, tag, tagval:tagval[0]})
    } catch (error) { console.log(error) }
    ""
});

//#endregion

//#region verNoticia 
router.get('/vernoticia/:id', async (req,res)=>{
    let {id} = req.params
    let id_noti = {id}
    //console.log(id_noti)
    try{
        let data = await pool.query("SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link FROM noticias n \
            JOIN usuarios u JOIN fuentes f WHERE n.id_noticia=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente", [id_noti.id])
        console.log(data[0])
        res.render('noticias/noticia.hbs', {data:data[0]})
    }catch(err) {console.log(err)}
    
});

//#endregion
module.exports = router;