const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth-route')
require('dotenv').config()
const app = express()


const port = process.env.PORT
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbUrl = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.jm2zckm.mongodb.net/${dbName}?retryWrites=true&w=majority`
mongoose.connect(dbUrl, {
}).then(() => {
    console.log('Database connected')
}).catch((err) => {
    console.error('Error connecting to the database:', err)
})
app.use(cors())
app.use(bodyParser.json())
app.use('/auth', authRoute)
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
