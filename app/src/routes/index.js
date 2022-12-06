const express = require('express')
const router = express.Router();

//Guests
router.get('/', (req, res)=>{
    res.redirect('/noticias/')
} );

router.get('/nosotros', async (req, res) => {  
    try{  
        res.render('nosotros.hbs', {tag:
        [
            { id: 1, nombre: 'Mundial' },
            { id: 2, nombre: 'Local' },
            { id: 3, nombre: 'Deportes' },
            { id: 4, nombre: 'Gastronomia' },
            { id: 5, nombre: 'Desarrollo Tecnologico' },
            { id: 6, nombre: 'Kids' },
            { id: 7, nombre: 'Arte y Cultura' },
            { id: 8, nombre: 'Medio Ambiente' }
        ]});  
    }catch(e){console.log(e)}
});

//Sistema de noticias
router.get('/login', (req, res) => {    
    res.redirect('/auth/');    
});
router.get('/logout', (req, res) =>{
    res.redirect('/auth/logout')
})
router.get('/admin', (req, res) => {    
    res.redirect('/admin/news/status/0');
});
router.get('/user', (req, res) => {    
    res.redirect('/user/borradores');    
});
module.exports = router;