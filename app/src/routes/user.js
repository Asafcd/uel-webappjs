const express = require('express')
const router = express.Router();
const pool = require('../database')

router.get('/listar', async (req,res) =>{
    res.render('user/listar.hbs')
})

module.exports = router;