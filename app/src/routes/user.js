const express = require("express");
const router = express.Router();
const pool = require("../database");
const multer = require("multer");
const path = require('path');
const mime = require('mime');
var fs = require('fs-extra');

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
//#region GETS
router.get("/borradores", async (req, res) => {
  try {
    let data = await pool.query(
      "SELECT * FROM noticias WHERE estado='Borrador'"
    );
    //console.log(data)
    res.render("user/noticias.hbs", { data });
  } catch (error) {
    console.log(error);
  }
});
router.get("/enviadas", async (req, res) => {
  try {
    let data = await pool.query(
      "SELECT * FROM noticias WHERE id_usuario=1 AND estado='Enviada'"
    );
    //console.log(data)
    res.render("user/noticias.hbs", { data });
  } catch (error) {
    console.log(error);
  }
});
router.get("/aceptadas", async (req, res) => {
  try {
    let data = await pool.query(
      "SELECT * FROM noticias WHERE id_usuario=1 AND estado='Aceptada'"
    );
    //console.log(data)
    res.render("user/noticias.hbs", { data });
  } catch (error) {
    console.log(error);
  }
});
//MENSAJES
router.get("/buzon", async (req, res) => {
  //const {id_noticia} = req.params
  //let id = {id_noticia}
  try {
    let data = await pool.query("SELECT * FROM noticias WHERE id_usuario=1");
    let datamensajes = await pool.query(
      "SELECT * FROM mensajes m JOIN noticias n WHERE m.id_noticia = n.id_noticia"
    );
    let mensajes = [];
    data.forEach((e) => {
      datamensajes.forEach((m) => {
        if (e.id_noticia == m.id_noticia) {
          mensajes.push({
            id_mensaje: m.id_mensaje,
            id_noticia: m.id_noticia,
            contenido: m.contenido,
            titulo: m.titulo,
          });
        }
      });
    });
    res.render("user/buzon.hbs", { mensajes });
  } catch (error) {
    console.log(error);
  }
});
router.get("/vermensaje/:id_mensaje", async (req, res) => {
  const { id_mensaje } = req.params;
  let mensaje = { id_mensaje };
  try {
    let data = await pool.query("SELECT * FROM mensajes WHERE id_mensaje=?", [
      mensaje.id_mensaje,
    ]);
    let noticia = await pool.query(
      "SELECT titulo, contenido, id_usuario FROM noticias WHERE id_noticia=?",
      [data[0].id_noticia]
    );
    let autor = await pool.query(
      "SELECT nombres, apellidos FROM usuarios WHERE id_usuario=?",
      [noticia[0].id_usuario]
    );
    console.log(autor);
    res.render("user/vermensaje.hbs", {
      data: data[0],
      noticia: noticia[0],
      autor: autor[0],
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/vernoticia/:id_noticia", async (req, res) => {
  const { id_noticia } = req.params;
  let id = { id_noticia };
  try {
    let data = await pool.query("SELECT * FROM noticias WHERE id_noticia=?", [ id.id_noticia ]);
    //console.log(data[0])
    let fuente = await pool.query("SELECT nombre, link FROM fuentes WHERE id_fuente=?", [data[0].id_fuente] );
    let autor = await pool.query(
      "SELECT id_usuario, nombres, apellidos FROM usuarios WHERE id_usuario=?",
      [data[0].id_usuario]
    );
    res.render("user/vernoticia.hbs", {
      data: data[0],
      fuente,
      autor: autor[0],
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/crearnoticia", async (req, res) => {
  try {
    let fuentes = await pool.query("SELECT * FROM fuentes");
    let users = await pool.query(
      "SELECT id_usuario, nombres, apellidos FROM usuarios"
    );
    let tag = await pool.query("SELECT * FROM etiquetas");

    res.render("user/crearnoticia.hbs", { users, tag, fuentes });
  } catch (error) {
    console.log(error);
  }
});

router.get("/editnoticia/:id_noticia", async (req, res) => {
  const { id_noticia } = req.params;
  let id = { id_noticia };
  try {
    let data = await pool.query("SELECT * FROM noticias WHERE id_noticia=?", [
      id.id_noticia,
    ]);
    let users = await pool.query(
      "SELECT id_usuario, nombres, apellidos FROM usuarios WHERE id_usuario=?",
      [data[0].id_usuario]
    );
    console.log(users);
    res.render("user/crearnoticia.hbs", { users, data });
  } catch (error) {
    console.log(error);
  }
});
router.get("/deletenoticia/:id_noticia", async (req, res) => {
  const { id_noticia } = req.params;
  let id = { id_noticia };
  try {
    await pool.query("DELETE FROM noticias WHERE id_noticia=?", [
      id.id_noticia,
    ]);
    res.redirect("/user/borradores");
  } catch (error) {
    console.log(error);
  }
});
router.get("/enviar/:id_noticia", async (req, res) => {
  const { id_noticia } = req.params;
  let id = { id_noticia };
  try {
    await pool.query(
      "UPDATE noticias SET estado='Enviada' WHERE id_noticia=?",
      [id.id_noticia]
    );
    res.redirect("/user/borradores");
  } catch (error) {
    console.log(error);
  }
});
//#endregion
//#region POSTS

router.post("/crearnoticia", upload, async (req, res) => {
  let idfolder=""
  let imgs = req.files
  //console.log(req.files)
  let img0=""
  let img1=""
  let img2=""
  let img3=""

  let { titulo, contenido, estado, etiqueta, autor, fuente, link  } = req.body;        
  let noticianew = { titulo, contenido, estado, etiqueta, autor, fuente, link };
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
          await pool.query( "INSERT INTO fuentes(nombre, link) VALUES(?,?)", [noticianew.fuente, noticianew.link] );
          } catch (err) { console.log(err); }
      }  
      let fuenteid = await pool.query("SELECT id_fuente FROM fuentes WHERE nombre = ?",[noticianew.fuente])
  //#endregion
  try {
    let noti = await pool.query(
            "INSERT INTO noticias(id_usuario,id_fuente,titulo,contenido,estado,etiqueta, img0,img1,img2,img3) VALUES(?,?,?,?,?,?,?,?,?,?)",
            [ noticianew.autor, fuenteid[0].id_fuente, noticianew.titulo, noticianew.contenido, noticianew.estado,
              noticianew.etiqueta, img0,img1,img2,img3 ]
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
        
        res.redirect('/user/borradores')
});

module.exports = router;
