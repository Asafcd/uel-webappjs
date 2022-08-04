const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region Router categories GETS
router.get('/mundiales', async (req,res)=>{
    try{
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'mundial' ORDER BY id_noticia DESC")
        res.render('noticias/mundiales.hbs', {data:data})
    }catch(err) {console.log(err)}
    
});
router.get('/locales', (req,res)=>{
    try {
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'local' ORDER BY id_noticia DESC")
        res.render('noticias/locales.hbs',{data})
    } catch (error) { console.log(error) }
    
});
router.get('/:tag', async (req,res)=>{
    let {tag} = req.params
    let etiq = {tag}
    try {
        let tag = await pool.query("SELECT * FROM etiquetas")
        let data = await pool.query(
            "SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link FROM noticias n \
            JOIN usuarios u JOIN fuentes f WHERE n.etiqueta=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente \
            ORDER BY n.id_noticia DESC", [etiq.tag])
        //let fuentes = await poo
        //console.log(data[0])
        res.render('noticias/templateSeccion.hbs',{data,tag})
    } catch (error) { console.log(error) }
    
});
router.get('/arte', (req,res)=>{
    try {
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'arte y cultura' ORDER BY id_noticia DESC")
        res.render('noticias/arte.hbs', {data:data})
    } catch (error) { console.log(error) }
    
});
router.get('/desarrollo', (req,res)=>{
    try {
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'tecnologia' ORDER BY id_noticia DESC")
        res.render('noticias/desarrollo.hbs',{data})
    } catch (error) { console.log(error) }
    
});
router.get('/medioambiente', (req,res)=>{
    try {
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'medio ambiente' ORDER BY id_noticia DESC")
        res.render('noticias/medioambiente.hbs',{data})
    } catch (error) { console.log(error) }
    
});
router.get('/gastronomia', (req,res)=>{
    try {
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'gastronomia' ORDER BY id_noticia DESC")
        res.render('noticias/gastronomia.hbs',{data})
    } catch (error) { console.log(error) }
    
});
router.get('/kids', (req,res)=>{
    try {
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'kids' ORDER BY id_noticia DESC")
        res.render('noticias/kids.hbs',{data})
    } catch (error) { console.log(error) }
    
});
//#endregion

//#region verNoticia 
router.get('/vernoticia/:id', async (req,res)=>{
    let {id} = req.params
    let id_noti = {id}
    //console.log(id_noti)
    try{
        let data = await pool.query("SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link FROM noticias n \
            JOIN usuarios u JOIN fuentes f WHERE n.id_noticia=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente \
            ORDER BY n.id_noticia DESC",[id_noti.id])
        console.log(data[0])
        res.render('noticias/noticia.hbs', {data:data[0]})
    }catch(err) {console.log(err)}
    
});

//#endregion
module.exports = router;