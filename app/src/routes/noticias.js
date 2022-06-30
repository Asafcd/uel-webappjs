const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region Router GETS
router.get('/mundiales', async (req,res)=>{
    try{
        let data = pool.query("SELECT * FROM noticias WHERE etiqueta = 'NoticiasMundiales'")
        res.render('noticias/mundiales.hbs', {data:data})
    }catch(err) {console.log(err)}
    
});
router.get('/locales', (req,res)=>{
    res.render('noticias/locales.hbs')
});
router.get('/deportes', (req,res)=>{
    res.render('noticias/deportes.hbs')
});
router.get('/arte', (req,res)=>{
    res.render('noticias/arte.hbs')
});
router.get('/desarrollo', (req,res)=>{
    res.render('noticias/desarrollo.hbs')
});
router.get('/medioambiente', (req,res)=>{
    res.render('noticias/medioambiente.hbs')
});
router.get('/gastronomia', (req,res)=>{
    res.render('noticias/gastronomia.hbs')
});
router.get('/kids', (req,res)=>{
    res.render('noticias/kids.hbs')
});
//#endregion

module.exports = router;