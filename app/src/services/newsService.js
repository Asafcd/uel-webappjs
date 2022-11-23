const pool = require('../database')

const getAllNews = async () => { 
    try {
        let qry = "SELECT * FROM noticias WHERE etiqueta='?'  ORDER BY id_noticia DESC LIMIT 4"    
        let tag = await pool.query("SELECT * FROM etiquetas")
        let mundial = await pool.query(qry, 1)
        let local = await pool.query(qry, 2)
        let deportes = await pool.query(qry, 3)
        let gastro = await pool.query(qry, 4)
        let tec = await pool.query(qry, 5)
        let kids = await pool.query(qry, 6)
        let arte = await pool.query(qry, 7)
        let ambi = await pool.query(qry, 8)
        //console.log(tag, mundial, local, deportes, gastro, kids, tec, arte, ambi)
        return {tag, mundial, local, deportes, gastro, kids, tec, arte, ambi}
    } catch (err) { throw { status: 500, error: err } } 
}

const getCategorizedNews = async (id) => {
   // let {id} = req.params
    let etiq = {id}
    try {
        let tagval = await pool.query("SELECT * FROM etiquetas WHERE id=?",[etiq.id])
        let tagname = await tagval[0].nombre.toUpperCase()
        tagval[0].nombre = tagname
        let tag = tagval[0].nombre
        let tags = await pool.query("SELECT * FROM etiquetas")
        let data = await pool.query(
            "SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link \
            FROM noticias n JOIN usuarios u JOIN fuentes f \
            WHERE n.etiqueta=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente         \
            ORDER BY n.id_noticia DESC", [etiq.id]) //AND n.estado='Aceptada'
        
        return {data, tags, tag}
    } catch (error) { throw { status: 500, error: error } }
}

const getOneNew = async (id) => {
  //  let {id} = req.params
    let id_noti = {id}
    //console.log(id_noti)
    try{
        let data = await pool.query("SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link FROM noticias n \
            JOIN usuarios u JOIN fuentes f WHERE n.id_noticia=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente", [id_noti.id])
        //let article = data[0]
        return data[0]
    }catch(err) {throw { status: 500, error: err }}
}

module.exports = {
    getAllNews,
    getCategorizedNews,
    getOneNew
}