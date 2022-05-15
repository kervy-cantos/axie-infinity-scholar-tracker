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
const cron = require('node-schedule')


router.get('*',catchasync(async (req,res,next)=>{
    
const sched  =  cron.scheduleJob('* 9 * * *', async function(){ 
    const rons = await roninAccounts.find();
    for(let ron of rons){
        fetch('https://game-api.axie.technology/api/v2/'+ ron.address)
        .then((data) => {
            return data.json();
        })
        .then(async(data) =>{
            if(data.success){
            const {mmr, in_game_slp, total_slp, next_claim,last_claim } = data
            
          await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronMMR: mmr}})
          await   roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronTotal: total_slp}})
          await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronIngame: in_game_slp}})
          await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronNextClaim: next_claim*1000}})
          await  roninAccounts.findByIdAndUpdate({_id: ron.id}, {$set:{ronLastClaim: last_claim*1000}})
          
            }
         })
    
        .catch((error) => {
            console.log(error);
    
        })
        console.log('updated successfully')
       
    }
    
})

next();
}))














module.exports = router;