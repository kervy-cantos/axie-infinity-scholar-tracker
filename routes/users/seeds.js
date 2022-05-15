const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/expresserror')
const Accounts = require('./models/account');
const roninAccounts = require('./models/roninaccounts')
const ejsMate = require('ejs-mate');
const fetch = require('node-fetch');
const catchasync = require('./utils/catchasync')
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local')
const userRoute = require('./routes/users/users')
const profileRoute = require('./routes/users/profile')
const flash = require('connect-flash');
const {isLoggedIn} = require('./authmiddleware')
const MongoStore = require('connect-mongo')


const dburl = 'mongodb+srv://kervy:cantos@isko.ezt2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
mongoose.connect(dburl, {
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () =>{
    console.log('Database Connected')
})

app.post


app.listen(3000, ()=>{
    console.log("server port 3000");
})