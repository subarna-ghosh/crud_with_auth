const express=require('express')
const route=express.Router()
const ProfileController=require('../controller/ProfileController')
const verifyToken=require('../middleware/verifyToken')
const uploadImage=require('../utils/uploadImage')

route.get('/',verifyToken,ProfileController.user)
route.put('/update',verifyToken,ProfileController.updateProfile)
route.put('/image',verifyToken,uploadImage.single('profileImage'),ProfileController.updateProfileImage)

module.exports=route