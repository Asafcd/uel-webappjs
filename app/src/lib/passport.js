const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require('../database')
const helpers = require('../lib/helpers')

/*#region REGISTRO
passport.use('local.signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const {names, lasts} = req.body
    const nwuser = {
        names, lasts,
        username,
        password
    };
    nwuser.password = await helpers.encryptPW(password)
    try{
        const data = await db.query("INSERT INTO usuarios(nombres, apellidos, enabled, username, password, id_rol) VALUES(?,?,1,?,?,2)",
        [nwuser.names, nwuser.lasts, nwuser.username, nwuser.password])
        nwuser.id = data.insertId
        nwuser.id_rol = 2
        console.log(nwuser)
        return done(null, nwuser, req.flash('success', "Registro exitoso") )
    }catch(e){console.log(e)}
}))
#endregion
*/

//#region LOGIN
passport.use('local.signin', new LocalStrategy({
    usernameField:'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const data = await pool.query("SELECT * FROM usuarios WHERE username= ?", [username])
    
    if (data.length > 0){
        const user = data[0]
        const validpw = await helpers.matchPw(password, user.password)
        if(validpw){
            console.log("yes")
           done(null, user, req.flash("exito","Bienvenido "+user.username))
        } else{
            console.log("no")
           done(null, false, req.flash("error","Contraseña Incorrecta") )
        }
    }else{
        console.log("no user")
        return done(null, false, req.flash('error','No se reconoce el nombre de usuario'))
    }
}))
//#endregion
passport.serializeUser((user, done)=>{
    done(null, user.id_usuario)
})
passport.deserializeUser( async (id, done)=>{
    let data = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id])
    done(null, data[0])
})