const helpers = {}
const path = require('path');
const multer = require('multer')

helpers.dateFormat = (date) =>{
    try{
        const mes = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
        var d = date.getDate()
        var m = date.getMonth()
        var y = date.getFullYear()
        m = mes[m]
        const fecha = d+"-"+m+"-"+y
        return fecha
    }catch(e){console.log(e)}
}

module.exports = helpers