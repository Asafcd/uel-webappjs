const express = require('express')
const router = express.Router();
const pool = require('../database')

//#region GUESTS
router.get('/', async (req, res) => {
    let qry = "SELECT * FROM noticias WHERE etiqueta='?' AND estado='Aceptada' ORDER BY id_noticia DESC LIMIT 4"
    
    try{
        let tag = await pool.query("SELECT * FROM etiquetas")
        tag.forEach(e => { //tags en mayus
            let n = e.nombre.toUpperCase()
            e.nombre = n
        });
        let mundial = await pool.query(qry, 1)
        let local = await pool.query(qry, 2)
        let deportes = await pool.query(qry, 3)
        let gastro = await pool.query(qry, 1)
        let tec = await pool.query(qry, 1)
        let kids = await pool.query(qry, 1)
        let arte = await pool.query(qry, 1)
        let ambi = await pool.query(qry, 1)
        console.log(mundial)
        res.render('home.hbs', {
            mundial, 
            local, deportes, gastro, kids, tec, arte, ambi,
            tag
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
    res.redirect('/admin/recibidas');
    
});


module.exports = router;