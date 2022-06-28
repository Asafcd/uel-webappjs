const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {    
    res.render('home.hbs', {title: 'Union es Logro'});    
});

router.get('/buzonUser', (req, res) => {    
    res.render('buzonUser.html', {title: 'uEL - buzon'});
    
});

router.get('/crearnoti', (req, res) => {    
    res.render('frmCrearNoticia.html', {title: 'UEL - Crear noticia'});
    
});

router.get('/listar', (req, res) => {    
    res.render('listar.html', {title: 'UEL - listar'});
    
});

router.get('/mensajeadmin', (req, res) => {    
    res.render('Mensajeadmin.html', {title: 'UEl Admin - mensaje'});
    
});

router.get('/menu', (req, res) => {    
    res.render('menu.html', {title: 'UEL - menu'});
    
});

router.get('/nosotros', (req, res) => {    
    res.render('nosotros.html', {title: 'UEL.'});
    
});

router.get('/noticia', (req, res) => {    
  res.redirect('./noticia/add')
    
});

router.get('/aceptadas', (req, res) => {    
    res.render('noticiasaceptadas.html', {title: 'UEL.'});
    
});

router.get('/NoticiasAdmin', (req, res) => {    
    res.render('NoticiasAdmin.html', {title: 'UEL.'});
    
});

router.get('/enviadas', (req, res) => {    
    res.render('noticiasEnviadas.html', {title: 'UEL.'});
    
});

router.get('/noticiasSeccion', (req, res) => {    
    res.render('noticiasSeccion.html', {title: 'UEL.'});
    
});

router.get('/privacidad', (req, res) => {    
    res.render('privpolicy.html', {title: 'UEL - Privacidad'});
    
});

router.get('/vermensaje', (req, res) => {    
    res.render('vermensaje.html', {title: 'UEL.'});
    
});

router.get('/verNoticiaUser', (req, res) => {    
    res.render('verNoticiaUser.html', {title: 'UEL.'});
    
});

router.get('/vistanoticia', (req, res) => {    
    res.render('vistanoticia.html', {title: 'UEL.'});
    
});

router.get('/login', (req, res) => {    
    res.render('login.html', {title: 'FIRMA CORP.'});
    
});
module.exports = router;