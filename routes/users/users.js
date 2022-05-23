const express = require('express');
const router = express.Router();
const Accounts = require('../../models/account');
const passport = require('passport')
const localStrategy = require('passport-local')
const catchasync = require('../../utils/catchasync');
const { isLoggedIn } = require('../../authmiddleware');
const Token = require('../../models/token');
const sendEmail = require('../../utils/forgot')
const crypto = require('crypto');
const { TIMEOUT } = require('dns');
const { appendFile } = require('fs');
const { findOneAndDelete } = require('../../models/account');
require('dotenv').config();





router.get('/register', (req, res) => {
    res.render('register');
})
router.post('/register', catchasync(async (req, res) => {
    try {
        const { name, username, email, password } = req.body.newu;
        const user = new Accounts({ email, name, username });
        const regUser = await Accounts.register(user, password);
        console.log(regUser);
        req.flash('success', "Thank you for registering " + name, ", you may now log in.");
        res.redirect('login');
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect('register');
    }
}))

router.get('/login', (req, res) => {
    res.render('login');

})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back ' + req.user.name + '!');
    const redirectUrl = req.session.returnTo || '/profile';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Thank You.');

    res.redirect('/');

})
router.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword')
})

router.post('/emailsent', catchasync(async (req, res) => {
    const email = req.body.email
    const confirm = await Accounts.findOne({ email: email })
    let mes = ""
    if (!confirm) {
        req.flash('error', 'user with the given email does not exist')

        res.redirect('/forgotpassword')
    }
    else {
        let token = await Token.findOne({ userId: confirm.id })
        if (!token) {
            token = await new Token({
                userId: confirm.id,
                token: crypto.randomBytes(32).toString('hex')
            }).save();

            const link = `${process.env.BASE_URL}/resetpassword/${confirm.id}/${token.token}`
            await sendEmail(confirm.email, "Password reset", link, confirm.name);
            mes = 'A reset password link has been sent'

        }
        else {
            mes = 'Please check your email or try again in an hour'
        }
        console.log(mes)
        res.render('emailsent', { mes })
    }
}))

router.get('/resetpassword/:id/:token', catchasync(async (req, res) => {
    const { id, token } = req.params
    const verify = await Token.findOne({ userId: id } && { token: token })
    if (!verify) {
        res.send('Invalid link or token has expired')
    } else {
        res.render('resetpassword')
    }
}))
router.post('/resetpassword/:id/:token', catchasync(async (req, res) => {
    const { id, token } = req.params
    const user = await Accounts.findOne({ _id: id })
    await user.setPassword(req.body.newPassword);
    await user.save();
    await Token.findOneAndDelete({ token: token });
    req.flash("success", 'Password has been changed. You can now log in.');
    res.redirect('/login')
}
))

module.exports = router;