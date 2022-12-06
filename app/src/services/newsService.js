const pool = require('../database')

const getAllNews = async () => { 
    try {
        let qry = "SELECT * FROM noticias WHERE etiqueta='?'  ORDER BY id_noticia DESC LIMIT 4"    
        let mundial = await pool.query(qry, 1)
        let local = await pool.query(qry, 2)
        let deportes = await pool.query(qry, 3)
        let gastro = await pool.query(qry, 4)
        let tec = await pool.query(qry, 5)
        let kids = await pool.query(qry, 6)
        let arte = await pool.query(qry, 7)
        let ambi = await pool.query(qry, 8)
        //console.log(tag, mundial, local, deportes, gastro, kids, tec, arte, ambi)
        return await { mundial, local, deportes, gastro, kids, tec, arte, ambi}
    } catch (err) { throw { status: 500, error: err } } 
}

const getNewsByCategory = async (id) => {
    try {
        let tagval = await pool.query("SELECT * FROM etiquetas WHERE id=?",[id])
        let tag = await tagval[0].nombre.toUpperCase()

        let data = await pool.query(
            "SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link \
            FROM noticias n JOIN usuarios u JOIN fuentes f \
            WHERE n.etiqueta=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente         \
            ORDER BY n.id_noticia DESC", [id])
        
        return {data, tag}
    } catch (error) { throw { status: 500, error: error } }
}
const getNewsByStatus = async (status) => {
    try {       
        let data = await pool.query("SELECT n.id_noticia, u.nombres, u.apellidos, n.titulo, n.estado FROM noticias n\
        JOIN usuarios u WHERE estado=? AND n.id_usuario = u.id_usuario", [status])
        return {data}
    } catch (error) { throw { status: 500, error: error } }
}

const getNewById = async (id) => {
    try{
        let data = await pool.query("SELECT n.*, u.nombres as username, u.apellidos as userlasts, f.nombre as fuente, f.link as link FROM noticias n \
            JOIN usuarios u JOIN fuentes f WHERE n.id_noticia=? AND n.id_usuario = u.id_usuario AND n.id_fuente = f.id_fuente", [id])
        return data[0]
    }catch(err) {throw { status: 500, error: err }}
}

const updateNewStatusById = async(id, status) =>{
    try{
        await pool.query("UPDATE noticias SET estado =? WHERE id_noticia =?",[status,id])
    }catch(err) {throw { status: 500, error: err }}
}

module.exports = {
    getAllNews,
    getNewsByCategory,
    getNewById,
    getNewsByStatus,
    updateNewStatusById
}