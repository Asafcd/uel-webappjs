const express = require('express')
const route = express.Router()
const pool = require('../database')

route.get('/add', (req,res) => {
    res.render('noticia/add.hbs')
})

module.exports = route