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
    return res.render('home', {files: [], fileName: ''})
})

router.post('/files', upload.array('files'), function(req, res){
    console.log(req.files)
    let files=[]
    if(req.files.length>=0){
        req.files.forEach(file => {
            files.push({originalname: file.originalname, path: file.path})
        });
        return res.render('home', { files: files, fileName: ''});
    }
    else{
        return res.render('home', { files: [], fileName: ''});
    }

})

router.post('/selectedFiles', (req, res)=>{
    console.log('SELECTED FILES:', req.body)
    const {fileName}=req.body

    let [filePath, originalname]=fileName.split(':')

    console.log('PATH OF SELECTED FILE:', path.join(__dirname+'/../'+filePath), originalname)

    filePath=path.join(__dirname+'/../'+filePath)

    fs.createReadStream(filePath)
    .on('data', function(data){
        //console.log('Data:', data.toString('utf-8'))
        data=data.toString('utf-8').split('\n')
        console.log('Data:', data, data.length)
        let finalData=[]
        data.forEach(row=>{
            finalData.push(row.split(','))
        })
        console.log(finalData[0], finalData[0].length, finalData[0][1], finalData.length)
        return res.status(200).json({
            fileName: originalname,
            data: finalData
        })
        //return res.render('displayTable', {data: finalData})
    })

    
})
module.exports=router