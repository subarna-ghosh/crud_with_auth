require("dotenv").config();
const express=require('express')
const cors=require('cors');
const app=express()
const db=require('./app/config/db')
db()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(cors(['http://localhost:3000']))
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const api=require('./app/routes')
app.use(api)

const port=3000
app.listen(port,()=>{
    console.log(`server is running on port-->http://localhost:${port}`)
})