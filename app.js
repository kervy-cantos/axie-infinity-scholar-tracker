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
const scheduleRoute = require('./routes/users/schedule')
const flash = require('connect-flash');
const {isLoggedIn} = require('./authmiddleware')
const MongoStore = require('connect-mongo')
const method = require('method-override')
const cron = require('node-cron');
require('dotenv').config();

const dburl = process.env.database;
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

const store = new MongoStore ({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60
})
store.on("error", function(e){
    console.log('unable to connect');
})
const sessionop = {
    secret: process.env.sessecret, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
    maxAge: 1000 * 60 * 60 * 24
},
    store: store
};
app.use(session(sessionop));

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(method());

passport.use(new localStrategy(Accounts.authenticate()));

passport.serializeUser(Accounts.serializeUser());
passport.deserializeUser(Accounts.deserializeUser());




app.use(flash());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoute);
app.use('/', profileRoute)
app.use('/', scheduleRoute)



app.get('/', (req,res)=>{
    res.render('home') 

})




app.post('/standalone', (req,res) =>{
    const ronin = req.body.searchRonin;
    fetch('https://game-api.axie.technology/api/v2/'+ ronin)
    .then((data) => {
        return data.json();
    })
    .then((data) =>{
    if (!data.success){
           req.flash('error', 'Please enter a valid ronin address');
           res.redirect('/home');
       }
       else
        res.render('standalone', {data: data, ronin: ronin})  
    
    })

    .catch((error) => {
        console.log("waley");

    })
}) 


app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404));
    
} ) 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("Server Online");
})

