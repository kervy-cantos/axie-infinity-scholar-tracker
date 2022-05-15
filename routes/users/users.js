const express = require('express');
const router = express.Router();
const Accounts = require('../../models/account');
const passport = require('passport')
const catchasync = require('../../utils/catchasync');
const {isLoggedIn} = require('../../authmiddleware');







router.get('/register', (req,res)=>{
    res.render('register');
})
router.post('/register',catchasync (async (req,res)=>{
try{
   const {name, username, email, password} = req.body.newu;
   const user = new Accounts({email, name, username});
   const regUser = await Accounts.register(user, password);
   console.log(regUser);
   req.flash('success', "Thank you for registering " + name ,", you may now log in.");
   res.redirect('login');
}
catch (e) {
    req.flash("error", e.message);
    res.redirect('register');
}
}))

router.get('/login', (req,res)=>{
    res.render('login');
    
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back '+req.user.name+'!');
    const redirectUrl = req.session.returnTo || '/profile';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success', 'Thank You.');
    
    res.redirect('/');
    
})
router.get('/forgotpassword', (req,res)=>{
    res.render('forgotpassword')
})
module.exports = router;