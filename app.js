const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());


//const { getAllEndpoints } = require("./controllers/endpoints")

const usersRoutes = require("./routes/users");

app.use(express.json());






app.use("/api/users", usersRoutes)


//SQL Errors
app.use((err,req,res,next) => {
  if(err.code === '23502'){
    res.status(400).send({msg:"Bad request"})
  }
  if(err.code === '22P02'){
    res.status(400).send({msg:"Bad request"})
  }else{
    next(err)
  }
})


app.use((err, req, res, next) => {
  console.log(err)
  if(err.status === 400){
    res.status(400).send({msg: "Bad request"})
  }
  if(err.status === 404){
    res.status(404).send({msg: "Not found"})
    }
  else{
        next()
  }
})



module.exports = app;