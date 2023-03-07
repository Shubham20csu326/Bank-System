const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth-route')
const app = express()
const port = process.env.PORT || 8080
const dbUsername = process.env.DB_USERNAME || 'Soumyadip'
const dbPassword = process.env.DB_PASSWORD || '20csu214'
const dbName = process.env.DB_NAME || 'Banking'
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
