const express = require("express"),
path          = require('path');
//test = require("./serviceconfig.js")

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public/')));

app.get("/", function(req, res){
  res.render('pages/index');
})

const port = process.env.PORT || 3002;

app.listen(port, function(){
  console.log(`Server started on port ${port}!`);
})
