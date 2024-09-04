const express = require('express');
const app = express();
const port = 3000;

const session = require('express-session')
const flash = require('connect-flash');

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}))

app.use(flash());

const web = require('./routes/web');

// To upload image
const fileUpload = require('express-fileupload')
//Tempfiles uploaderz
app.use(fileUpload({useTempFiles:true}))

//To get data as Object
app.use(express.urlencoded({extended:false}))

// const connectDb = require('./db/dbcon.js');
// connectDb();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/',web);

app.listen(port,()=>{
    console.log('Port 3000 Ready to Listen');
});