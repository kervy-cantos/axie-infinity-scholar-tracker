const nodemailer = require('nodemailer');

const sendEmail = async(email, subject, text, name) =>{
    try{
        const transporter= nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port:587,
            secure:true,
            auth:{
                user: process.env.USER,
                pass: process.env.PASS

            }

        })
        await transporter.sendMail({
            from: process.env.USER,
            to:email,
            subject:subject,
            text:"Hello "+ name +"! Please click on the link to reset your password",text
        })
        console.log('email sent');
    }
    catch(error){
        console.log(error,'email not sent');
    }
    }
    module.exports= sendEmail