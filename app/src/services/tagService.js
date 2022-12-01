const pool = require('../database')

const getAllTags = async() =>{
    try {
        let tags = await pool.query("SELECT * FROM etiquetas")
        return tags
    } catch (error) { throw { status: 500, error: error } }
}

module.exports = {
    getAllTags
}