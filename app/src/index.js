// CONST
const express = require("express");
const cukip = require("cookie-parser")
const bodyparser = require("body-parser")
const exhbs = require('express-handlebars')
const path = require("path");
const morgan = require('morgan')
const favicon = require('serve-favicon');

const app = express();

//SETTINGS
app.set("port", process.env.PORT || 80); //este port debe coincidir con el INTERNO del docker
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exhbs.engine({
  defaultLayout:'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
 // helpers: require('./lib/handlebars')
  }));
app.set("view engine", "hbs");

//middlewares
app.use(morgan('dev'))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json())

//GLOBALS
app.use((req,res,next)=>{
  next()
})

//ROUTES
app.use(require("./routes/index"));
app.use(require('./routes/authentication'))
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