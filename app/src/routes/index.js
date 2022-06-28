const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region GUESTS
router.get('/', async (req, res) => {
    try{
        let data = await pool.query("SELECT * FROM noticias")
        console.log(data[0])
        res.render('home.hbs', {data:data});  
    }catch(err){console.log(err)}  
});

router.get('/nosotros', (req, res) => {    
    res.render('nosotros.hbs');    
});
router.get('/canales', (req, res) => {    
    res.render('canales.hbs');    
});
//SECCIONES DE NOTICIAS para guests
router.get('/mundiales', (req, res) => {    
    res.redirect('noticias/mundiales');    
});
router.get('/locales', (req, res) => {    
    res.redirect('noticias/locales');    
});
router.get('/deportes', (req, res) => {    
    res.redirect('noticias/deportes');    
});
router.get('/arte', (req, res) => {    
    res.redirect('noticias/arte');    
});
router.get('/desarrollo', (req, res) => {    
    res.redirect('noticias/desarrollo');    
});
router.get('/medioambiente', (req, res) => {    
    res.redirect('noticias/medioambiente');    
});
router.get('/gastronomia', (req, res) => {    
    res.redirect('noticias/gastronomia');    
});
router.get('/kids', (req, res) => {    
    res.redirect('noticias/kids');    
});
//#endregion

router.get('/login', (req, res) => {    
    res.render('login.hbs');    
});

router.get('/user', (req, res) => {    
    res.redirect('/user/listar');
    
});
router.get('/admin', (req, res) => {    
    res.redirect('/admin/menu');
    
});


module.exports = router;