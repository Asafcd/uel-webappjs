const express = require('express')
const router = express.Router();
const pool = require('../database')

router.get('/menu', async (req,res)=>{
    res.render('admin/menu.hbs')
})


module.exports = router;