const fs = require('fs')

const path=require('path')
const utils=require('../utils/utils.js')
console.log('Utils')



module.exports.files=function(req, res){
    
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

}

module.exports.selectedFiles=(req, res)=>{
    console.log('SELECTED FILES:', req.body)
    const {fileName}=req.body

    let [filePath, originalname]=fileName.split(':')

    console.log('PATH OF SELECTED FILE:', path.join(__dirname+'/../'+filePath), originalname)

    filePath=path.join(__dirname+'/../'+filePath)

    fs.createReadStream(filePath)
    .on('data', function(data){
        data=data.toString('utf-8').split('\n')
        console.log('Data:', data, data.length)
        data=data.map(el=>{
            if(el[el.length-1]=='\r'){
                return el.slice(0, el.length-1)
            }
            else{
                return el
            }
        })
        let finalData=[]
        data.forEach(row=>{
            finalData.push(utils.splitIntoTokens(row))
        })
        console.log(finalData[0], finalData[0].length, finalData[0][1], finalData.length)
        return res.status(200).json({
            fileName: originalname,
            data: finalData
        })
    })
}