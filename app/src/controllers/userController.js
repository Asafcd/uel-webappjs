const multer = require("multer");
const path = require("path");
const mime = require("mime");
var fs = require("fs-extra");
const { dateFormat } = require("../lib/helpers");
const { encryptPW } = require("../lib/helpers");
const userService = require("../services/userService");
const newsService = require("../services/newsService");
const msgService = require("../services/mensajeService");

let today = new Date(Date.now());
let hoy = dateFormat(today);

//#region config metodo para subida de archivos
var dir = path.join(__dirname, "../public/img/noticias-imagenes/");
const storage = multer.diskStorage({
  destination: dir,
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({
  storage: storage,
}).array("newsImages", 4);
//#endregion

const createUser = async (req, res) => {
  const body = req.body;
  const pwEncrypted = await encryptPW(body.password);
  try {
    const user = {
      names: body.names,
      lasts: body.lasts,
      enabled: 1,
      username: body.username,
      password: pwEncrypted,
      id_rol: 2,
    };
    const newUser = await userService.createUser(user);
    // let tag = "Usuario creado: "+ newUser.username
    res.status(200).redirect("/admin/users/");
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getUsers = async (req, res) => {
  let tag = "Usuarios";
  try {
    const users = await userService.getUsers();
    res.status(200).render("admin/users.hbs", { data: users, tag: tag });
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  let tag = "Editar Usuario";
  try {
    const user = await userService.getUserById(id);
    res.status(200).render("admin/edituser.hbs", { data: user[0], tag: tag });
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const getProfile = (req,res) =>{
    try {
    res.render("user/perfil.hbs");
  } catch (err) { res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } });  }
}

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { names, lasts, username } = req.body;
  const user = { names, lasts, username, id };
  try {
    const data = await userService.updateUserById(user);
    res.status(200).redirect("/admin/users/");
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    //const user = await userService.getUserById(id)
    await userService.deleteUserById(id);
    res.status(200).redirect("/admin/users/");
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const redirection = async (req, res) => {
  const user = req.user;
  const {id_status} = req.params
  if (user.id_rol === 1) {
    res.redirect("/admin");
  }
  if (user.id_rol === 2) {
    let status = "";
    switch (id_status) {
        case '0':
            status = "Borrador";
            break;
        case '1':
            status = "Enviada";
            break;
        case '2':
            status = "Aceptada";
            break;
        case '3':
            status = "Rechazada";
            break;
        default:
            break;
    }
    
    try {
        if(status==='Rechazada'){
            const data = await newsService.getDeclinedNewsByUserId(user.id_usuario)
            res.status(200).render("user/noticiasrechazadas.hbs", { data:data, tag:status });
        }
        let data = await newsService.getNewsByUserId(user.id_usuario, status);
        console.log(data)
        res.status(200).render("user/noticias.hbs", { data, status });
    } catch (err) { res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } }); }
  }
};

const getMsgByUser = async(req,res) =>{
    const user = req.user
    try{
        const data = await msgService.getMensajesByUserId(user.id_usuario)
        res.status(200).render("user/buzon.hbs", { mensajes:data })
    }catch (err) { res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } }); }
}

const getMsgById = async(req,res) =>{
    const user = req.user
    const {id_mensaje} = req.params
    
    try{
        const data = await msgService.getMensajeById(id_mensaje)
        console.log(data, user)
        res.status(200).render("user/vermensaje.hbs", {data:data, autor:user})
    }catch (err) { res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } }); }
}

const getNewById = async(req,res) =>{
    const user = req.user
    const {id_noticia} = req.params
    try{
        const data = await newsService.getNewById(id_noticia)
        res.status(200).render("user/vernoticia.hbs", {data:data})
    }catch (err) { res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } }); }
}

const sendNewToAdmin = async(req,res) =>{
    const user = req.user
    const {id_noticia} = req.params
    try{
        await newsService.updateNewStatusById(id_noticia,'Enviada')
        res.redirect("/user/news/status/0");
    }catch (err) { res.status(err?.status || 500).send({ status: "FAILED", data: { error: err?.message || err } }); }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateUserById,
  deleteUserById,
  redirection,
  getMsgByUser,
  getMsgById,
  getNewById,
  sendNewToAdmin
};
