const express = require('express')
const router = express.Router();
const pool = require('../database')

//Guests
router.get('/', async (req, res) => { //AND estado='Aceptada'
    let qry = "SELECT * FROM noticias WHERE etiqueta='?'  ORDER BY id_noticia DESC LIMIT 4"    
    
    try{
        let tag = await pool.query("SELECT * FROM etiquetas")
        let mundial = await pool.query(qry, 1)
        let local = await pool.query(qry, 2)
        let deportes = await pool.query(qry, 3)
        let gastro = await pool.query(qry, 4)
        let tec = await pool.query(qry, 5)
        let kids = await pool.query(qry, 6)
        let arte = await pool.query(qry, 7)
        let ambi = await pool.query(qry, 8)
        console.log(mundial)
        res.render('home.hbs', {
            mundial, local, deportes, gastro, kids, tec, arte, ambi,
            tag
            });
        }          
    catch(err){console.log(err)}  
});

router.get('/nosotros', async (req, res) => {  
    try{
        let tag = await pool.query("SELECT * FROM etiquetas")  
        res.render('nosotros.hbs', {tag});  
    }catch(e){console.log(e)}
});

//Sistema de noticias
router.get('/login', (req, res) => {    
    res.redirect('/auth/login');    
});
router.get('/user', (req, res) => {    
    res.redirect('/user/borradores');    
});
router.get('/perfil', (req, res) => {    
    res.redirect('/user/perfil');    
});
router.get('/admin', (req, res) => {    
    res.redirect('/admin/recibidas');
});
router.get('/logout', (req, res) =>{
    res.redirect('/auth/logout')
})
module.exports = router;