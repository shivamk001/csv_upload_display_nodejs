const express=require('express')
const path=require('path')
const bodyParser=require('body-parser')

require('dotenv').config()

//express app
const app=express()

//to include req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

//set up ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//app.use(expressLayouts)


//where to get the static files from
app.use(express.static('./assets'))

app.use('/', require('./routes'))


app.listen(process.env.PORT, (err)=>{
    console.log('App up and running on 8888')
})