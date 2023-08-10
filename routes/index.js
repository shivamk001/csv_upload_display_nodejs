const express=require('express')
const router=express.Router()

const homeContoller=require('../controller/homeContoller')
router.get('/', homeContoller.home)
router.use('/files', require('./files'))

module.exports=router