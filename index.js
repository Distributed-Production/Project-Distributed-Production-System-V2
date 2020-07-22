const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const pass = require('password-hash')


const db = require('mongoose')
const api = require('./routers/api')
require('dotenv/config')

const app = express()
const projects = require('./models/project')
const user_model = require('./models/user')
const mmodel = require('./models/member')


app.use('/assets', express.static('assets'))
app.use('/ourprojects/assets', express.static('assets'))
app.use('/search-project/assets', express.static('assets'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', api)
app.use(session({
    secret: 'padmin123',
    resave: false,
    saveUninitialized: true
}))

db.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Connection was successful')
    }
})

app.set('view engine', 'ejs')

var x = 0;


function gets_projects(req, res, next) {

    projects.find().then((data, error) => {
        // console.log(data)
        if (error) {
            req.body.projects = []
            next()
        } else {
            req.body.projects = data
            next()
        }
    }).catch((err) => {
        console.log(err);
        next()
    })
}

app.get('/xs', (req, res) => {

    if (req.session.counter == '') {
        x = 0
    } else {
        x = req.session.counter += 1
    }

    res.render('sess', {
        data: req.session.id
    })
})
app.get('/', (req, res) => {
    if (req.session) {
        const data = req.session
        res.render('index', {
            data: { data },
            session: req.session.username
        })

    } else {
        const data = {}
        res.render('index', {
            data: {},
            session: null
        })
    }

})

app.get('/signup', (req, res) => {
    res.render('signup', {
        session: null
    })
})

app.post('/login', gets_projects, async(req, res) => {
    try {
        const login = await user_model.findOne({
            email: req.body.email
        })

        if (!login._id) {
            res.render('login', { data: 'Invalid username or password.' })
        } else {
            if (pass.verify(req.body.password, login.password)) {
                // session information
                // req.session = login
                req.session.username = req.body.email
                req.session.usid = login._id

                // res.render('login', { data: { code: 1, session_data: login } })
                res.render('projects', {
                    data: req.body.projects,
                    session: req.session.username

                })
            } else {
                res.render('login', { data: { message: 'Login Not Successful', name: '' }, session: '' })
                    // res.render('login', { data: { code: 0, message: 'Invalid username or password.' } })
            }
        }
    } catch (error) {
        res.render('loginsuccess', { data: { message: 'Login Not Successful', name: '' } })
    }
})
app.get('/loginsuccess', (req, res) => {

})
app.get('/login', (req, res) => {
    res.render('login', {
        data: {},
        session: null
    })
})

app.get('/projects', gets_projects, (req, res) => {
    if (!req.body.projects_error) {
        res.render('projects', { data: req.body.projects, session: req.session.username })
    } else {
        res.render('error_page', { data: {} })
    }
})
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('login', {
            data: {},
            session: null
        })
    })

})

app.get('/search', async(req, res) => {
    // projects.createIndexes({ proj_name: "text" })
    try {
        const data = await projects.find()

        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400)
    }
})

app.get('/search-project/:project', async(req, res) => {
    const search_string = req.params.project
    const search_project_name = search_string.split(" - ")

    const project_found = await projects.find({ proj_name: search_project_name[0], proj_location: search_project_name[1] })

    res.render('search-project', { data: project_found, session: req.session.username })
        // res.send(project_found);
})
app.get('/ourprojects/:id', gets_projects, async(req, res) => {
    if (req.session.username) {
        try {
            // console.log(session_name)mmber_data
            const project_data = await projects.findOne({ _id: (req.params.id).toString() })
            const member_data = await mmodel.find({ proj_id: req.params.id })
            res.render('ourprojects', {
                    data: project_data,
                    nonce: req.session.id,
                    uid: req.session.usid,
                    members_data: member_data,
                    session: req.session.username
                })
                //mem: member_data
        } catch (error) {
            console.log(error)
            res.render('projects', { data: req.body.projects, session: req.session.username, error: 'No project found matching your criteria' })
        }
    } else {
        res.redirect(301, '/login')
    }
})

app.get('/header', (req, res) => {
    res.render('header')
})
app.get('/padmin', (req, res) => {
    res.render('projectadmin', {
        session: null
    })
})
app.get('/dashboard', (req, res) => {
    res.render("dash")
})
app.get('/success', (req, res) => {
    res.json("req.body")
})

app.get('/header1', (req, res) => {
    res.render('header1')
})

app.get('/member', (req, res) => {
    res.render('member', {
        session: null,
        // data: data
    })

})

app.listen(process.env.PORT || 8080, (error) => {
    if (error)
        console.log('Error: Could not connect ' + error)

    console.log('Your Web app is listening on port http://localhost:' + process.env.PORT)
})