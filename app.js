const express = require('express');
const app = express();
const port = 3000;
const dotenv= require('dotenv')
dotenv.config({ path: "./.env" });
const connectDB= require('./db/dbcon.js')
const cookieParser=require('cookie-parser')


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
// const fileUpload = require('express-fileupload')
//Tempfiles uploaderz
// app.use(fileUpload({useTempFiles:true}))

//To get data as Object
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.json({limit:"16kb"}))

// const connectDb = require('./db/dbcon.js');
// connectDb();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/',web);
app.use(cookieParser())

connectDB()
  .then(() => {
    app.listen(Number(process.env.PORT) || 3000, () => {
      console.log(`Server is running at port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed", err);
  });