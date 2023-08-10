function splitIntoTokens(str){
    console.log("String:", str)
    let found=false
    let column=''
    let row=[]
    str.split(',').forEach(word=>{
        if(word[0]=='"'){
            if(word.length==2 && word[1]=='"'){
                row.push("")
            }
            else{
                found=true
                column+=word
            }
        }
        else{
            if(found){
                if(word[word.length-1]=='"'){
                    column+=', '+word
                    found=false
                    row.push(column.slice(1, column.length-1))
                }
                else{
                    column+=', '+word
                }
            }
            else{
                row.push(word)
            }
        }
    })
    return row
}

module.exports={splitIntoTokens}