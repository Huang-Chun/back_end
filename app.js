const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")
const cors = require('cors')
const bodyParser = require('body-parser')

var multer  = require('multer')
const router = require("./routes")
var upload = multer()


const app = express()

//passport config
require("./config/passport")(passport)

//Cors policy
app.use(cors())


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  // res.header( "Access-Control-Allow-Credentials", true )
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requseted-With, Accept, Authorization",
    "Content-Type : application/json"
  )
  if (req.method ==="OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).jason()
  }
  next() 
})


//DB Config
const db = require("./config/keys").MongoURI

//Connect to MONGO
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }) //useUnifiedTopology: true 報錯要我加的
    .then(() => console.log("MongoDB Connect..."))
    .catch(err => console.log(err))
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// EXPRESS SESSION 5500
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash());

// Global variables 給跳出訊息用的
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users")) 


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`)) 


