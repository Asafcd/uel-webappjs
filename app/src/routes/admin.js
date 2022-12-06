const express = require('express')
const aut = require('../lib/auth')
const userController = require('../controllers/userController')
const newsController = require('../controllers/newsController')
const adminController = require('../controllers/adminController')
const router= express.Router();

router
    .get('/news/status/:id_status', aut.isAdmin, newsController.getNewsByStatus)
    .get('/news/:id_noticia', aut.isAdmin, adminController.getNewById)
    .post('/news/:id_noticia/:status_boolean', aut.isAdmin, adminController.updateStatusNewById)
    .get('/mensaje/:id_noticia', aut.isAdmin, adminController.getNewDeclinedById)
    .post('/mensaje/:id_noticia', adminController.postMensaje)

//#region Gestion de usuarios
    .get('/users', aut.isAdmin, userController.getUsers)
    .get('/users/:id', aut.isAdmin, userController.getUserById)
    .post('/users/:id', aut.isAdmin, userController.updateUserById)
    .get('/usersR/:id', aut.isAdmin, userController.deleteUserById)
    .get('/signup', aut.isAdmin, (req, res) =>{ res.render('admin/signup.hbs')})
    .post('/signup', aut.isAdmin, userController.createUser )
//#endregion
module.exports = router;