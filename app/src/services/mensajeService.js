const pool = require('../database')

const postMensaje = async(id_noticia, contenido) => {
    try {
        const createdMsg = await pool.query("INSERT INTO mensajes(id_noticia, contenido) VALUE(?,?)", [id_noticia, contenido])
        return createdMsg
    } catch (error) { throw { status: 500, error: error } }
}

module.exports = {
    postMensaje
}