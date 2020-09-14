const express = require("express")
const mongoose = require('mongoose')
const session = require("express-session")
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require("./routes")
const mysql = require("mysql")
const app = express()
const User = require("./models/User") //call user model

//Cors policy
app.use(cors())


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
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

//Connect to MONGO
mongoose.connect("mongodb://localhost/DemoDB",{ useNewUrlParser: true, useUnifiedTopology: true }) 

var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function(){
  console.log("MongoDB Connect...")
})

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

//Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users")) 

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`)) 


