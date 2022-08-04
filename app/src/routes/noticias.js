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
router.get('/deportes', async (req,res)=>{
    try {
        let data = await pool.query(
            "SELECT n.*, u.nombres as username, u.apellidos as userlasts FROM noticias n JOIN usuarios u WHERE n.etiqueta='deportes' AND n.id_usuario = u.id_usuario ORDER BY n.id_noticia DESC")
        //let fuentes = await poo
        console.log(data)
        res.render('noticias/deportes.hbs',{data})
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
/*router.get('/vernoticia/:id', async (req,res)=>{
    let id = req.params
    console.log(id)
    try{
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'mundial' ORDER BY id_noticia DESC")
        res.render('noticias/mundiales.hbs', {data:data})
    }catch(err) {console.log(err)}
    
});
*/
//#endregion
module.exports = router;