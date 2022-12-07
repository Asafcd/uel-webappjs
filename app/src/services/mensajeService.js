const pool = require('../database')

const getMensajesByUserId = async(id_usuario) =>{
    try{
        const data = await pool.query("SELECT * FROM mensajes m JOIN noticias n WHERE n.id_usuario = ? AND m.id_noticia = n.id_noticia",
        [id_usuario])
        return data        
    }catch (error) { throw { status: 500, error: error } }
}
const getMensajeById = async(id_mensaje) =>{
    try{
        const data = await pool.query("SELECT m.id_noticia, m.contenido as mensaje, n.id_noticia, n.titulo, n.contenido \
        FROM mensajes m JOIN noticias n WHERE m.id_mensaje = ? AND m.id_noticia = n.id_noticia",
        [id_mensaje])
        return data        
    }catch (error) { throw { status: 500, error: error } }
}
const postMensaje = async(id_noticia, contenido) => {
    try {
        const createdMsg = await pool.query("INSERT INTO mensajes(id_noticia, contenido) VALUE(?,?)", [id_noticia, contenido])
        return createdMsg
    } catch (error) { throw { status: 500, error: error } }
}

module.exports = {
    getMensajesByUserId,
    getMensajeById,
    postMensaje
}