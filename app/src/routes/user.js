const express = require("express");
const router = express.Router();
const pool = require("../database");
const multer = require("multer");
const path = require('path');
const mime = require('mime');
var fs = require('fs-extra');
const aut = require('../lib/auth');
const { dateFormat } = require("../lib/helpers");
const userController = require('../controllers/userController')
const newsController = require('../controllers/newsController')

let today = new Date(Date.now())
let hoy = dateFormat( today)

//#region config metodo para subida de archivos
var dir = path.join(__dirname, '../public/img/noticias-imagenes/')
const storage = multer.diskStorage({
    destination: dir,
    filename: function(req,file,cb){
        const fileName = file.originalname 
        cb(null,fileName);
    }
})
const upload = multer({
  storage:storage
}).array("newsImages",4)
//#endregion
//#region GETS

router
  .get("/perfil/", aut.isLoggedin, userController.getProfile)
  .get("/news/status/:id_status", aut.isLoggedin, userController.redirection)

  //MENSAJES
  .get("/buzon", aut.isLoggedin, userController.getMsgByUser)
  .get("/buzon/:id_mensaje",aut.isLoggedin, userController.getMsgById)

  //NOTICIAS
  .get("/crearnoticia", aut.isLoggedin, newsController.getNewsForm)
  .get("/news/:id_noticia",aut.isLoggedin, userController.getNewById)
  .get("/editnoticia/:id_noticia",aut.isLoggedin, newsController.getNewsForm)
  .get("/deletenoticia/:id_noticia", aut.isLoggedin, newsController.deleteNewById)
  .get("/enviarnoticia/:id_noticia", aut.isLoggedin, userController.sendNewToAdmin)




router.post("/crearnoticia", upload, async (req, res) => {
  let user = req.user
  let idfolder=""
  let imgs = req.files
  let img0=""
  let img1=""
  let img2=""
  let img3=""

  let { titulo, contenido, estado, etiqueta, fuente, link, autor  } = req.body;        
  let noticianew = { titulo, contenido, estado, etiqueta, fuente, link, autor };
 //#region asignar nombres de imagenes para la bd
  switch(imgs.length){

        case 1:
          img0 = imgs[0].filename                 
          break;
        case 2:
          img0 = imgs[0].filename       
          img1 = imgs[1].filename       
          break;
        case 3:
          img0 = imgs[0].filename       
          img1 = imgs[1].filename 
          img2 = imgs[2].filename
          break;
        case 4:
          img0 = imgs[0].filename       
          img1 = imgs[1].filename 
          img2 = imgs[2].filename
          img3 = imgs[3].filename
          break;
      }
//#endregion
//#region Crear entidades desde el add form, solo si no existen y no son strings vacios
      let aa = noticianew.fuente.toLowerCase()
      let aabool = false;
      let fuentes = await pool.query("SELECT * FROM fuentes");

      fuentes.forEach((a) => {
          if (aa.indexOf(a.nombre.toLowerCase()) !== -1 || aa==="") {
          aabool = true;
          }    
      });
      if (!aabool) {
          try {
          await pool.query( "INSERT INTO fuentes(nombre, link) VALUES(?,?)", [noticianew.fuente, noticianew.link] );
          } catch (err) { console.log(err); }
      }  
      let fuenteid = await pool.query("SELECT id_fuente FROM fuentes WHERE nombre = ?",[noticianew.fuente])
  //#endregion
  try {
    let noti = await pool.query(
            "INSERT INTO noticias(id_usuario,id_fuente,titulo,contenido,estado,etiqueta, img0,img1,img2,img3, fecha, autor) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
            [ user.id_usuario, fuenteid[0].id_fuente, noticianew.titulo, noticianew.contenido, noticianew.estado,
              noticianew.etiqueta, img0,img1,img2,img3, hoy, autor ]
            );  
    idfolder = noti.insertId //id de la noticia recien insertada
  } catch (error) { console.log(error) }

//#region mover imagenes a carpeta con id_noticia
  var newpath = dir+idfolder+"/"
  if (!fs.existsSync(newpath)){
          fs.mkdirSync(newpath);
      }

  switch(imgs.length){
    case 1:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success1")
      })
      break;
    case 2:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success!0")
      })
      fs.move( dir+img1, newpath+img1, function (err) {
        if (err) return console.error(err)
        console.log("success!1")
      })
      break;
    case 3:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success!0")
      })
      fs.move( dir+img1, newpath+img1, function (err) {
        if (err) return console.error(err)
        console.log("success!1")
      })
      fs.move( dir+img2, newpath+img2, function (err) {
        if (err) return console.error(err)
        console.log("success!2")
      })
      break;
    case 4:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success0")
      })
      fs.move( dir+img1, newpath+img1, function (err) {
        if (err) return console.error(err)
        console.log("success1")
      })
      fs.move( dir+img2, newpath+img2, function (err) {
        if (err) return console.error(err)
        console.log("success2")      
      })
      fs.move( dir+img3, newpath+img3, function (err) {
        if (err) return console.error(err)
        console.log("success3")
      })
      break;
  }
  //#endregion
        req.flash("success", "Noticia creada con exito")
        res.redirect('/user/borradores')
});

router.post("/editnoticia/:id_noticia", upload, async (req, res) => {
  let user = req.user
  const { id_noticia } = req.params;
  let id = { id_noticia };
  let idfolder = id.id_noticia
  let imgs = req.files
  let img0=""
  let img1=""
  let img2=""
  let img3=""
  let fuenteid=""
  let { titulo, contenido, estado, etiqueta, fuente, link, autor  } = req.body;        
  let noticianew = { titulo, contenido, estado, etiqueta, fuente, link, autor };
  switch(imgs.length){//asignar nombres de imagenes para la bd
        case 1:
          img0 = imgs[0].filename                 
          break;
        case 2:
          img0 = imgs[0].filename       
          img1 = imgs[1].filename       
          break;
        case 3:
          img0 = imgs[0].filename       
          img1 = imgs[1].filename 
          img2 = imgs[2].filename
          break;
        case 4:
          img0 = imgs[0].filename       
          img1 = imgs[1].filename 
          img2 = imgs[2].filename
          img3 = imgs[3].filename
          break;
      }
//#region Crear entidades desde el add form, solo si no existen y no son strings vacios
      let aa = noticianew.fuente.toLowerCase()
      let aabool = false;
      let fuentes = await pool.query("SELECT * FROM fuentes");

      fuentes.forEach((a) => {
          if (aa.indexOf(a.nombre.toLowerCase()) !== -1 || aa==="") {
          aabool = true;
          }    
      });
      if (!aabool) {
          try {
          let fuente = await pool.query( "INSERT INTO fuentes(nombre, link) VALUES(?,?)", [noticianew.fuente, noticianew.link] );
          fuenteid = fuente.insertedId
          } catch (err) { console.log(err); }
      } else{
        let fuente = await pool.query("SELECT id_fuente FROM noticias WHERE id_noticia =?",[idfolder])
        fuenteid = fuente[0].id_fuente
        }
      
  //#endregion

//#region mover imagenes a carpeta con id_noticia
  var newpath = dir+idfolder+"/"
  switch(imgs.length){
    case 1:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success1")
      })
      break;
    case 2:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success!0")
      })
      fs.move( dir+img1, newpath+img1, function (err) {
        if (err) return console.error(err)
        console.log("success!1")
      })
      break;
    case 3:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success!0")
      })
      fs.move( dir+img1, newpath+img1, function (err) {
        if (err) return console.error(err)
        console.log("success!1")
      })
      fs.move( dir+img2, newpath+img2, function (err) {
        if (err) return console.error(err)
        console.log("success!2")
      })
      break;
    case 4:
      fs.move( dir+img0, newpath+img0, function (err) {
        if (err) return console.error(err)
        console.log("success0")
      })
      fs.move( dir+img1, newpath+img1, function (err) {
        if (err) return console.error(err)
        console.log("success1")
      })
      fs.move( dir+img2, newpath+img2, function (err) {
        if (err) return console.error(err)
        console.log("success2")      
      })
      fs.move( dir+img3, newpath+img3, function (err) {
        if (err) return console.error(err)
        console.log("success3")
      })
      break;
  }
  //#endregion
  try {
    await pool.query(
            "UPDATE noticias SET id_usuario=?,id_fuente=?,titulo=?,contenido=?,estado=?,etiqueta=?, img0=?,img1=?,img2=?,img3=?, autor=? WHERE id_noticia=?",
            [ user.id_usuario, fuenteid, noticianew.titulo, noticianew.contenido, noticianew.estado,
              noticianew.etiqueta, img0,img1,img2,img3, autor, idfolder ]
            );      
    res.redirect("/user/borradores")
  } catch (error) { console.log(error) }
  
});

module.exports = router;
