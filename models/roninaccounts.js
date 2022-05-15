const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose')
const sequence = require('mongoose-sequence')(mongoose);
const Now = Date.now();

const roninSchema = new Schema({
    address:{
        type: String,
        unique: false
    },
    ronIngame: {
        type: Number,
        default: 0
    },
    ronTotal:{
        type: Number,
        default: 0
    },
    ronMMR:{
        type:Number,
        default: 0 
    },
    mshare:{
        type:Number,
        default:100
    },
    
    ronName:String,
    ronNextClaim:{
        type: Date,
        default: Now
    },
    ronLastClaim:{
        type: Date,
        default: Now

    },
    owner:[{
        type: Schema.Types.ObjectId,
        ref:'Users'
    }]
})

module.exports = mongoose.model('ronin', roninSchema)
