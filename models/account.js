const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose')


const AccountSchema = new Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    totalSlp:{
        type:Number,
        default: 0
    },
    roninaccts:[{
        type: Schema.Types.ObjectId,
        ref:'ronin'
    }]
})
AccountSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model('Users', AccountSchema);