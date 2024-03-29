// CONST
const express = require("express");
const flash = require('connect-flash')
const exhbs = require('express-handlebars')
const path = require("path");
const morgan = require('morgan')
const favicon = require('serve-favicon');
const session = require('express-session')
const MySqlStore = require('express-mysql-session')
const passport = require('passport')
const {database}  = require('./keys')


//Initialization
const app = express();
require('./lib/passport');

//SETTINGS
app.set("port", process.env.PORT || 80); //este port debe coincidir con el INTERNO del docker
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exhbs.engine({
  defaultLayout:'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
  }));
app.set("view engine", "hbs");

//middlewares
app.use(session({
  secret: 'uelsession',
  resave:false,
    saveUninitialized:false,
    store: new MySqlStore( database )
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//GLOBALS
app.use((req,res,next)=>{
  app.locals.error = req.flash('error');
  app.locals.exito = req.flash('exito');
  app.locals.user = req.user
  next()
})

//ROUTES
app.use(require("./routes/index"));
app.use('/auth', require('./routes/auth'))
app.use('/noticias', require('./routes/noticias'))
app.use('/admin',require('./routes/admin'))
app.use('/user',require('./routes/user'))


//STATIC FILES
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname,'public/img/favicon.ico')));

//LISTENING SERVER
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
  //console.log(path.join(__dirname, 'views/index.html'));
});