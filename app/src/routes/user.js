const express = require("express");
const router = express.Router();
const pool = require("../database");
const multer = require("multer");
const path = require('path');
const mime = require('mime');
var fs = require('fs-extra');
const aut = require('../lib/auth');
const { dateFormat } = require("../lib/helpers");

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
router.get("/borradores", aut.isLoggedin, async (req, res) => {
  let user = req.user
  if (user.id_rol===1){res.redirect('/admin')}
  if(user.id_rol===2){
    let tag = "Borrador"
    try {
      let data = await pool.query(
        "SELECT * FROM noticias WHERE estado='Borrador' AND id_usuario=?",[user.id_usuario]
      );
      //console.log(data)
      res.render("user/noticias.hbs", { data, tag });
    } catch (error) { console.log(error); }
  }  
});
router.get("/enviadas", aut.isLoggedin, async (req, res) => {
  let user = req.user
  let tag="Enviada"
  try {
    let data = await pool.query(
      "SELECT * FROM noticias WHERE estado='Enviada'AND id_usuario=?",[user.id_usuario]
    );
    //console.log(data)
    res.render("user/noticias.hbs", { data, tag });
  } catch (error) {
    console.log(error);
  }
});
router.get("/aceptadas", aut.isLoggedin, async (req, res) => {
  let user = req.user;
  let tag = "Aceptadas"
  try {
    let data = await pool.query(
      "SELECT * FROM noticias WHERE estado='Aceptada' AND id_usuario=?",[user.id_usuario]
    );
    //console.log(data)
    res.render("user/noticias.hbs", { data, tag });
  } catch (error) {
    console.log(error);
  }
});
router.get("/rechazadas", aut.isLoggedin, async (req, res) => {
  let user = req.user
  let tag = "Rechazadas"
    try{
      let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado, m.contenido as mensaje FROM noticias n\
        JOIN usuarios u JOIN mensajes m WHERE n.estado='Rechazada' AND n.id_usuario=? AND n.id_usuario = u.id_usuario AND n.id_noticia = m.id_noticia",[user.id_usuario])   
      res.render("user/noticiasrechazadas.hbs", { data,tag });
  } catch (error) {
    console.log(error);
  }
});
//MENSAJES
router.get("/buzon", aut.isLoggedin, async (req, res) => {
  let user = req.user
  
  try {
    let data = await pool.query("SELECT * FROM noticias");
    let datamensajes = await pool.query(
      "SELECT * FROM mensajes m JOIN noticias n WHERE n.id_usuario = ? AND m.id_noticia = n.id_noticia", [user.id_usuario]
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
router.get("/vermensaje/:id_mensaje",aut.isLoggedin, async (req, res) => {
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

router.get("/crearnoticia", aut.isLoggedin, async (req, res) => {
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

router.get("/vernoticia/:id_noticia",aut.isLoggedin, async (req, res) => {
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
      fuente: fuente[0],
      autor: autor[0],
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/editnoticia/:id_noticia",aut.isLoggedin, async (req, res) => {
  const { id_noticia } = req.params;
  let id = { id_noticia };
  try {
    let data = await pool.query("SELECT * FROM noticias WHERE id_noticia=?", [ id.id_noticia ]);
    let users = await pool.query("SELECT id_usuario, nombres, apellidos FROM usuarios WHERE id_usuario=?", [data[0].id_usuario] );
    let tag = await pool.query("SELECT * FROM etiquetas");
    let fuentes = await pool.query("SELECT * FROM fuentes");
    //console.log(users);
    res.render("user/editar.hbs", { users:users[0], data:data[0], tag, fuentes });
  } catch (error) {
    console.log(error);
  }
});
router.get("/deletenoticia/:id_noticia", aut.isLoggedin, async (req, res) => {
  const { id_noticia } = req.params;
  let id = { id_noticia };
  try {
    await pool.query("DELETE FROM noticias WHERE id_noticia=?", [
      id.id_noticia,
    ]);
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
});
router.get("/enviarnoticia/:id_noticia", aut.isLoggedin, async (req, res) => {
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

router.get("/perfil/", aut.isLoggedin, async (req, res) => {
 // let user = req.user
  try {
    //let data = await pool.query( "SELECT * FROM usuarios WHERE id_usuario=?", [user.id_usuario]);
    res.render("user/perfil.hbs");
  } catch (error) {
    console.log(error);
  }
});
//#endregion
//#region POSTS

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
//#endregion
module.exports = router;
