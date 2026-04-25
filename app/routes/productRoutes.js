const express=require('express')
const route=express.Router()
const ProductController=require('../controller/ProductController')
const verifyToken=require('../middleware/verifyToken')
const uploadImage=require('../utils/uploadImage')

route.post('/create',verifyToken,uploadImage.single('image'),ProductController.create)
route.get('/all',verifyToken,ProductController.list)
route.get('/one/:id',verifyToken,ProductController.single)
route.put('/update/:id',verifyToken,uploadImage.single('image'),ProductController.update)
route.delete('/hard/:id',verifyToken,ProductController.hard);
route.delete('/soft/:id',verifyToken,ProductController.soft);
route.patch('/restore/:id',verifyToken,ProductController.restore)
module.exports=route