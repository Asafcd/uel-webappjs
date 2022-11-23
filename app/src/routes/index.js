const express = require('express')
const router = express.Router();
const pool = require('../database')
const newsController = require('../controllers/newsController')

//Guests
router.get('/', newsController.getAllNews );

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