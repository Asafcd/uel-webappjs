const bcrypt = require('bcryptjs')
const helpers = {}

//signup
helpers.encryptPW = async(password) => {
    const salt = await bcrypt.genSalt(10)
    const crpw = await bcrypt.hash(password, salt)
    return crpw
}

//login
helpers.matchPw = async(password, savedPassword) =>{
    try{
        return await bcrypt.compare(password, savedPassword)
    }catch(e){console.log(e)}        
};

//Date Format
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