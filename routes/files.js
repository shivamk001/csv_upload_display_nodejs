const express=require('express')
const router=express.Router()
const fileController=require('../controller/filesController')
const multer  = require('multer')
const upload = multer({ 
    dest: 'uploads/', 
    fileFilter: function fileFilter(req, file, cb){
        
        let fileExt=file.originalname.split('.')[1]
        console.log('Filefilter:',file, fileExt)
        if(fileExt=='csv'){
            cb(null, true)
        }
        else{
            cb(null, false)
        }        
} })
router.post('/', upload.array('files'), fileController.files)
router.post('/selectedFiles', fileController.selectedFiles)
module.exports=router