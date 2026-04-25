const express=require('express')
const route=express.Router()
const AuthController=require('../controller/AuthController')
const uploadImage=require('../utils/uploadImage')

route.post('/register',uploadImage.single('profileImage'),AuthController.register)
route.post('/login',AuthController.login)

module.exports=route