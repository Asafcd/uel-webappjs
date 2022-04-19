// CONST
const express = require("express");
const ejs = require("ejs")
const app = express();
const path = require("path");

//SETTINGS
app.set("port", 80);
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

//ROUTES
app.use(require("./routes/views"));

//STATIC FILES
app.use(express.static(path.join(__dirname, "public/static")));

//LISTENING SERVER
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
  //console.log(path.join(__dirname, 'views/index.html'));
});