const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/login', (req, res) => {    
    res.render('auth/login.hbs');    
});

router.get('/signup', (req, res) =>{
    res.render('auth/signup.hbs')
})
router.post('/signup', passport.authenticate('local.signup', { 
    succesRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
    })
);

module.exports = router