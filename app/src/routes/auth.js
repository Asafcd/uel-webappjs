const express = require('express')
const passport = require('passport');
const pool = require('../database');
const router = express.Router()
const helpers = require('../lib/helpers')
const aut = require('../lib/auth')

router.get('/login', aut.isNotLoggedin, (req, res) => {    
    res.render('auth/login.hbs');    
});
router.post('/login', async (req,res, next)=>{
    try{
        passport.authenticate('local.signin', {
        successRedirect:'/user',
        failureRedirect: '/login', failureFlash:true,
    })(req,res, next)
    } catch(er){console.log(er)}    
})

router.get('/logout', (req, res) =>{
    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})
router.get('/signup', (req, res) =>{
    res.render('auth/signup.hbs')
})

router.post('/signup', aut.isAdmin, async (req, res) =>{
    const {names, lasts, username, password} = req.body
    const nwuser = { names, lasts, username, password };
    nwuser.password = await helpers.encryptPW(password)
    try{
        const data = await pool.query("INSERT INTO usuarios(nombres, apellidos, enabled, username, password, id_rol) VALUES(?,?,1,?,?,2)",
        [nwuser.names, nwuser.lasts, nwuser.username, nwuser.password])
        nwuser.id = data.insertId
        nwuser.id_rol = 2
        
        req.flash("success","Usuario creado con exito")
        res.redirect('/login')
    }catch(e){console.log(e)}
})

/* The IDEAL Method for sign in
router.post('/signup', passport.authenticate('local.signup', {
    succesRedirect: './user',
    failureRedirect: '/signup', failureFlash:true
    })
);
*/
module.exports = router