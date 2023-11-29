const fs = require('fs')
const path=require('path')
const utils=require('../utils/utils.js')

//console.log('Utils')
function deleteFile(){
    try{
        console.log(Date.now())
        let dirPath=path.join(__dirname, '..', 'uploads')
        console.log(dirPath)
        fs.readdir(dirPath, (err, files)=>{
            console.log(files, err)
            files.map(file=>{
                //console.log(path.join(dirPath, file))
                fs.unlink(path.join(dirPath, file), (err)=>{
                    if(err){console.log(`Error deleteing file: ${err}`)}
                    console.log(`File deleted successfully`)
                })
            });
            console.log('Files deleted successfully')
        })
    }
    catch(err){
        console.log(`Error in deleted files: ${err}`)
    }
}

//RECEIVES THE FILES UPLOADED THEN SEND THE LIST OF FILES TO SELECT FROM 
module.exports.files=function(req, res){
    
    console.log("REQ.FILES:", req.files)
    let files=[]
    if(req.files.length>0){
        req.files.forEach(file => {
            files.push({originalname: file.originalname, path: file.path})
        });
        console.log('FILES REQ.LOCALS.FILE:', req.locals.msg)
        return res.render('uploadedFiles', { files: files, fileName: '', msg: req.locals.msg});
    }
    else{
        console.log('FILES REQ.LOCALS.FILE:', req.locals.msg)
        res.render('home', { files: [], fileName: '', msg: req.locals.msg});
        return;
        console.log('FILES REQ.LOCALS.FILE:', req.locals.msg)
    }

}

//this function will read the selected file and send the data
module.exports.selectedFiles=async (req, res)=>{
    try{
        console.log('SELECTED FILES:', req.body)
        const {fileName}=req.body

        let [filePath, originalname]=fileName.split(':')

        //console.log('PATH OF SELECTED FILE:', path.join(__dirname+'/../'+filePath), originalname)

        filePath=path.join(__dirname+'/../'+filePath)
        
        //get size of selected fiel
        const fileSize=fs.statSync(filePath).size
        console.log('File Size:', fileSize)

        if(fileSize>200000){
            console.log('File Size too large. Please select a file of size less than 200KB.')
            //res.render('home', { files: [], fileName: '', msg: 'File Size too large. Please select a file of size less than 200KB.'});
            return res.status(400).json({
                fileName: fileName,
                data: [],
                error: 'File Size too large. Please select a file of size less than 200KB.'
            })
            //return res.error('File Size too large. Please select a file of size less than 200KB.', 400)
        }
        else{
            let finalData=[]
            const readStream=fs.createReadStream(filePath)
            console.log(process.env.TIME)
            setTimeout(()=>{
                console.log(Date.now())
                deleteFile()
            }, process.env.TIME)
            readStream
            .on('data', function(data){
                data=data.toString('utf-8').split('\n')
                //console.log('Data:', data, data.length)
                console.log('ghvhfvrherih:', data.length)
                data=data.map(el=>{
                    if(el[el.length-1]=='\r'){
                        return el.slice(0, el.length-1)
                    }
                    else{
                        return el
                    }
                })
                
                data.forEach(row=>{
                    finalData.push(utils.splitIntoTokens(row))
                })
                console.log('GVBFKDHKBVFK:', finalData[0], finalData[0].length, finalData[0][1], finalData.length)
            })
            readStream.on('end', ()=>{
                console.log('FINALDATA LENGTH:', finalData.length)
                console.log(finalData)
                return res.status(200).json({
                    fileName: originalname,
                    data: finalData
                })
            })
        }

    }
    catch(err){
        console.log('ERROR:', err)
        return res.render('home', { files: [], fileName: '', msg: 'Please select a file.'});
    }
}