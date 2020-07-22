const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newProject = new Schema({
    proj_name: {
        type: String,
        required: true
    },
    proj_location: {
        type: String,
        required: true
    },
    proj_brief: {
        type: String,
        required: true,
    },
    proj_justification: {
        type: String
    },
    proj_description: {
        type: String,
    },
    proj_images: []
})

const pmodel = mongoose.model('projects', newProject)
module.exports = pmodel