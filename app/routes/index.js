const express=require('express')
const route=express.Router()

const authRoutes=require('./authRoutes')
route.use('/api/auth',authRoutes)

const profileRoutes=require('./profileRoutes')
route.use('/api/profile',profileRoutes);

const productRoutes=require('./productRoutes')
route.use('/api/products',productRoutes)

module.exports=route