const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/expresserror')
const Accounts = require('./models/account');
const roninAccounts = require('./models/roninaccounts')
const ejsMate = require('ejs-mate');
const fetch = require('node-fetch');
const catchasync = require('./utils/catchasync')

const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local')
const userRoute = require('./routes/users/users')
const profileRoute = require('./routes/users/profile')

const flash = require('connect-flash');
const {isLoggedIn} = require('./authmiddleware')
const MongoStore = require('connect-mongo')
const method = require('method-override')
require('dotenv').config();
const cron = require('node-schedule');
const roninaccounts = require('./models/roninaccounts');

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
    const rule = new cron.RecurrenceRule();
        rule.hour = 23;
        rule.minute = 55;
        rule.tz = 'GMT+0';
    const sched  =  cron.scheduleJob(rule,catchasync(async function(){ 
        const rons = await roninAccounts.find();
        for(let ron of rons){
            fetch('https://game-api.axie.technology/api/v2/'+ ron.address)
            .then((data) => {
                return data.json();
            })
            .then(async(data) =>{
                if(data.success){
                const {mmr, in_game_slp, total_slp, next_claim,last_claim } = data
                    const yesterday = roninAccounts.findOne({_id:ron.id})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronMMR: mmr}})
              await   roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronTotal: total_slp}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronIngame: in_game_slp}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronNextClaim: next_claim*1000}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronLastClaim: last_claim*1000}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{slpYesterday: in_game_slp}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{recordYesterday: yesterday.slpToday}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$push:{daily: yesterday.slpToday}})
              await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{slpToday: 0}})
              console.log('updated successfully')
                }
             })
        
            .catch((error) => {
                console.log(error);
        
            })
           
           
        }
        
    }))
    

    
app.use('/', userRoute);
app.use('/', profileRoute)




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

