const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');

const memeSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: true
    },
    caption: {
        type: String, 
        required: true
    },
    url : {
        type: String, 
        required: true
    }
});

autoIncrement.initialize(mongoose.connection);
memeSchema.plugin(autoIncrement.plugin, 'Submit');

const Submit = new mongoose.model("Submit", memeSchema);

module.exports = Submit;