const pool = require('../database')

const getAllFuentes = async() =>{
    try {
        let fuentes = await pool.query("SELECT * FROM fuentes")
        return fuentes
    } catch (error) { throw { status: 500, error: error } }
}

const getFuentebyId = async(id) => {
    try {
        let fuente = await pool.query("SELECT nombre, link FROM fuentes WHERE id_fuente=?", [id] );
        return fuente
    } catch (error) { throw { status: 500, error: error } }
}

module.exports = {
    getAllFuentes,
    getFuentebyId
}