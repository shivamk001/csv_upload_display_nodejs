const express=require('express')
const fs = require('fs')
const multer  = require('multer')
const path=require('path')
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

//router
const router=express.Router()

router.get('/', (req, res)=>{
    return res.render('home', {files: [], selectedFiles: []})
})

router.post('/files', upload.array('files'), function(req, res){
    console.log(req.files)
    let files=[]
    if(req.files.length>=0){
        req.files.forEach(file => {
            files.push({name: file.originalname})
        });
        return res.render('home', { files: files, selectedFiles: []});
    }
    else{
        return res.render('home', { files: [], selectedFiles: []});
    }

})

router.post('/selectedFiles', (req, res)=>{
    console.log('SELECTED FILES:', req.body)
    let selectedFiles=[]
    for (let key in req.body) {
        console.log(key, req.body[key]);
        selectedFiles.push(req.body[key])
      }

    console.log('PATH OF SELECTED FILE:', path.join(__dirname+'/../'+'/uploads'+'/'+selectedFiles[0]))

    let filePath=path.join(__dirname+'/../'+'/uploads'+'/'+selectedFiles[0])

    fs.createReadStream(filePath)
    .on('data', function(data){
        console.log(data)
    })

    return res.render('home', {files: [], selectedFiles})
})
module.exports=router