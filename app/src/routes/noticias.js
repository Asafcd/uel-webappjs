const express = require('express')
const newsRouter = express.Router();
const newsController = require('../controllers/newsController')

newsRouter
.get('/', newsController.getAllNews )
.get('/tag/:id', newsController.getNewsByCategory )
.get('/:id_noticia', newsController.getNewById )

module.exports = newsRouter;