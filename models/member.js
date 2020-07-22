const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectMembers = new Schema({
    proj_id: {
        type: String
    },
    member_id: {
        type: String
    },
    mem_name: {
        type: String,
        required: true
    },
    mem_position: {
        type: String,
        required: true,
    },
    mem_location: {
        type: String,
        required: true,
    },
    pos_description: {
        type: String
    },

    proj_images: []
})

const mmodel = mongoose.model('members', projectMembers)

module.exports = mmodel