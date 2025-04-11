const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true 
    },
    uploadBy: {
        type: mongoose.Schema.Types.ObjectId, //Refers to another document by ID
        ref: 'User', //That ID belongs to the User model
        required: true
    }
},{timestamps: true});
//populate() : Fetches and replaces ID with full data
module.exports = mongoose.model('Image',ImageSchema)