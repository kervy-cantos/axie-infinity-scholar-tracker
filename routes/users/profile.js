const express = require('express');
const router = express.Router();
const Accounts = require('../../models/account');
const passport = require('passport')
const {isLoggedIn} = require('../../authmiddleware')
const ExpressError = require('../../utils/expresserror');
const catchasync = require('../../utils/catchasync');
const roninAccounts = require('../../models/roninaccounts')
const session = require('express-session');
const mongoose = require('mongoose')
const method = require('method-override')
const fetch = require('node-fetch');




router.get('/profile', isLoggedIn ,catchasync(async (req, res)=>{
  const prof1 = await Accounts.findOne({_id: req.user.id}).populate('roninaccts')
  const prof = prof1.roninaccts
  for (let ups of prof){
    fetch('https://game-api.axie.technology/api/v2/'+ ups.address)
    .then((data) => {
        return data.json();
    })
    .then(async(data) =>{
        if(data.success){
        const {mmr, in_game_slp, total_slp, next_claim,last_claim, rank } = data
        
      await  roninAccounts.findByIdAndUpdate({_id: ups.id}, {$set:{ronMMR: mmr}})
      await  roninAccounts.findByIdAndUpdate({_id: ups.id}, {$set:{ronTotal: total_slp}})
      await  roninAccounts.findByIdAndUpdate({_id: ups.id}, {$set:{ronIngame: in_game_slp}})
      await  roninAccounts.findByIdAndUpdate({_id: ups.id}, {$set:{ronNextClaim: next_claim*1000}})
      await  roninAccounts.findByIdAndUpdate({_id: ups.id}, {$set:{ronLastClaim: last_claim*1000}})
      await  roninAccounts.findByIdAndUpdate({_id: ups.id}, {$set:{rank: rank}})
        }
     })

    .catch((error) => {
        console.log(error);

    })
   
}
  console.log(prof1.roninaccts)
res.render('profile', {prof})

   }))



router.post('/profile',isLoggedIn, catchasync(async (req,res)=>{
    fetch('https://game-api.axie.technology/api/v2/'+ req.body.address)
    .then((data)=>{
        return data.json();
    })
    .then(catchasync(async (data)=>{
        if(data.success){
            const newRonin = await new roninAccounts(req.body);
            await newRonin.save();
            const owners = await Accounts.findOneAndUpdate({_id: req.user.id}, {$push:{roninaccts: newRonin.id}})
            req.flash('success', 'Added Successfully.')
            res.redirect('/profile')
        }
        else{
            req.flash('error', 'Please enter a valid address');
            res.redirect('/profile')
        }
}))
    .catch((error)=>{
        req.flash('error', 'Something went wrong');
        res.redirect('/profile')
    })
   
}))
router.post('/profile/delete/:id',isLoggedIn, catchasync(async (req,res) =>{
    const { id } = req.params;
    await Accounts.findByIdAndUpdate(req.user.id, {$pull: {roninaccts: id}})
    await roninAccounts.findByIdAndDelete(id)
    console.log(id)
    res.redirect('/profile')

}))

router.post('/profile/edit/:id', isLoggedIn, catchasync(async(req,res)=>{
    const {id} = req.params;
    await roninAccounts.findByIdAndUpdate(id, {$set:{ronName: req.body.ronName}})
    await roninAccounts.findByIdAndUpdate(id, {$set:{address: req.body.address}})
    await roninAccounts.findByIdAndUpdate(id, {$set:{mshare: req.body.mshare}})
    
    console.log('success');
    req.flash('success', 'updated successfully.')
    res.redirect('/profile')

}))



module.exports = router;