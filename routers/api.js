const express = require('express')
const user_model = require('../models/user')
const route = express.Router()
const app = express()
const passh = require('password-hash')
const pmodel = require('../models/project')
const mmodel = require('../models/member')

// const mmodel = require('../models/member')
app.set('view engine', 'ejs')

//create a new user
route.post('/create-user', async(req, resp) => {
        const user_data = {
            email: req.body.email,
            password: passh.generate(req.body.password),
            confirm_password: passh.generate(req.body.confirm_password),
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            address: req.body.address

        }

        // convert the data to mongo schema
        const user_model_ = new user_model(user_data)

        // save
        try {
            const dbsave = await user_model_.save()
            if (dbsave._id) {
                resp.json({ code: 1, message: 'YOu have successfully registered' })
            } else {
                resp.json({ code: 0, message: 'Failed to create account' })
                console.log(dbsave)
            }

        } catch (error) {
            console.log(error)
            resp.json({ code: 0, message: 'An error occured.' })
        }
    })
    /*create a new project*/
route.post('/create-project', async(req, resp) => {
    const project_data = req.body

    try {
        const p_model = new pmodel(project_data)
        const dbsave = await p_model.save()
        console.log(dbsave)
        if (dbsave._id) {
            resp.json({ code: 1, message: 'Project added successfully' })
        } else {
            resp.json({ code: 0, message: 'Failed to create project' })
            console.log(dbsave)
        }

    } catch (error) {
        console.log(error)
        resp.json({ code: 0, message: 'An error occured.' })
    }
})

/*create members*/
route.post('/create-member', async(req, resp) => {
    const members_data = req.body

    try {
        const m_model = new mmodel(members_data)
        const dbsave = await m_model.save()
        console.log(dbsave)
        if (dbsave._id) {
            resp.json({ code: 1, message: 'Member added successfully' })
        } else {
            resp.json({ code: 0, message: 'Failed to add member' })
            console.log(dbsave)
        }

    } catch (error) {
        console.log(error)
        resp.json({ code: 0, message: 'An error occured.' })
    }
})

/*login*/
route.post('/login', async(req, resp) => {
        console.log('endpoint hit')
        try {
            const users_data = await user_model.findOne({
                email: req.body.email,
            })

            if (users_data._id) {
                if (passh.verify(req.body.password, users_data.password) == true) {
                    req.session = login
                    resp.render('dashboard', { data: req.session })
                        // resp.redirect('/dashboard')
                        // resp.json({ code: 1, data: users_data, message: 'You have successfully logged in.' })
                } else {
                    resp.render('login', { data: { code: 0 } })
                        // resp.json({ code: 0, message: 'Invalid username or password' })
                }
                //window.localStorage.setItem('gjkh', users_data._id)

            } else {
                resp.render('login', { data: { code: 0 } })
                    // resp.json({ code: 0, message: 'Invalid username or password.' })
            }
        } catch (err) {
            // resp.json({ message: 'An error occured during getting records' })
            resp.render('login', { data: { code: 0 } })
            console.log(err)
        }
    })
    //get all users in the db
route.get('/users', async(req, resp) => {

    try {
        const users_data = await user_model.find()
        resp.json({ users: users_data })
    } catch (err) {
        resp.json({ message: 'An error occured during getting records' })
        console.log(err)
    }
})

//find all members in
route.get('/members', async(req, resp) => {

    try {
        const members_data = await mmodel.find()
        resp.json({ members: members_data })
    } catch (err) {
        resp.json({ message: 'cannot get all members' })
        console.log(err)
    }
})


route.get('/projects', async(req, resp) => {
    try {
        const project_data = await pmodel.find()
        resp.json({ project: project_data })
    } catch (err) {
        resp.json({ message: 'Cannot access the projects' })
        console.log(err)
    }
})


//delete a user in the db
route.post('/delete-user/:id', async(req, resp) => {
    try {
        const delete_user = await user_model.deleteOne({ _id: req.params.id })
        if (delete_user.deletedCount > 0) {
            resp.json({ message: 'User deleted successfully.' })
        } else {
            resp.json({ message: 'No record matched the id provided' })
        }
        //(delete_user)
    } catch (error) {
        resp.json({ message: 'An error occurred while removing the record' })
    }
})

route.post('/update-user/:id', async(req, resp) => {
    try {
        const recordUpdate = await user_model.updateOne({
            _id: req.params.id
        }, {
            username: req.body.username,
            password: req.body.password
        })

        resp.json({
            code: 1,
            message: 'Record has been updated successfully'
        })
    } catch (error) {
        resp.json({
            code: 0,
            message: 'AN error occured record not updated'
        })
    }
})


module.exports = route