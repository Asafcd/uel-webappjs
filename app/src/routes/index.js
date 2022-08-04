const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region GUESTS
router.get('/', async (req, res) => {    
    try{
        let mundial = await pool.query("SELECT * FROM noticias WHERE etiqueta='mundial' ORDER BY id_noticia DESC LIMIT 4")  
        let local = await pool.query("SELECT * FROM noticias WHERE etiqueta='local' ORDER BY id_noticia DESC LIMIT 4")  
        let deportes = await pool.query("SELECT * FROM noticias WHERE etiqueta='deportes' ORDER BY id_noticia DESC LIMIT 4")  
        let gastro = await pool.query("SELECT * FROM noticias WHERE etiqueta='gastronomia' ORDER BY id_noticia DESC LIMIT 4")  
        let kids = await pool.query("SELECT * FROM noticias WHERE etiqueta='kids' ORDER BY id_noticia DESC LIMIT 4")  
        let tec = await pool.query("SELECT * FROM noticias WHERE etiqueta='tecnologia' ORDER BY id_noticia DESC LIMIT 4")  
        let arte = await pool.query("SELECT * FROM noticias WHERE etiqueta='arte y cultura' ORDER BY id_noticia DESC LIMIT 4")  
        let ambi = await pool.query("SELECT * FROM noticias WHERE etiqueta='medio ambiente' ORDER BY id_noticia DESC LIMIT 4")          
        res.render('home.hbs', {
            mundial, local, deportes, gastro, kids, tec, arte, ambi
            });
        }          
    catch(err){console.log(err)}  
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
    res.redirect('/user/borradores');
    
});
router.get('/admin', (req, res) => {    
    res.redirect('/admin/menu');
    
});


module.exports = router;