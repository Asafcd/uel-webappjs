const express = require('express')
const passport = require('passport');
const pool = require('../database');
const router = express.Router()
const helpers = require('../lib/helpers')
const aut = require('../lib/auth')

router.get('/', aut.isNotLoggedin, (req, res) => {    
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

/* The IDEAL Method for sign in
router.post('/signup', passport.authenticate('local.signup', {
    succesRedirect: './user',
    failureRedirect: '/signup', failureFlash:true
    })
);
*/
module.exports = router