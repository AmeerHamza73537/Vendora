// const { config } = require('dotenv')
const express = require('express')
const ErrorHandler = require('./utils/ErrorHandler')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const user = require('./controller/user')
const cors = require('cors')

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api/v2/user', user)
app.use("/", express.static("uploads"))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// config
if(process.env.NODE_ENV !== 'production') {
    require("dotenv").config({
        path: 'backend/config/.env'
    })
}

// For Error Handling
app.use(ErrorHandler)

module.exports = app