const express=require('express')
const router=express.Router()
const fileController=require('../controller/filesController')
const multer  = require('multer')
const upload = multer({ 
    dest: 'uploads/', 
    fileFilter: function fileFilter(req, file, cb){
        console.log("File:", file)
        let arr=file.originalname.split('.')
        let len=arr.length
        let fileExt=arr[len-1]
        //console.log('Filefilter:',file, fileExt)
        if(fileExt=='csv'){
            req.locals={}
            req.locals.msg=''
            console.log('MSG:', req.locals.msg)
            cb(null, true)
        }
        else{
            req.locals={}
            req.locals.msg='Wrong file extension. Please upload a csv file.'
            console.log(req.locals.msg)
            cb(null, false)
        }        
} })
//'files' in upload.array() is the name of input
router.post('/', upload.array('files'), fileController.files)
router.post('/selectedFiles', fileController.selectedFiles)
module.exports=router