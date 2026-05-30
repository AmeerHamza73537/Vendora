const { pipeline } = require('nodemailer/lib/xoauth2');
const app = require('./app')
const connectDatabase = require('./db/Database')
// Handling Unchaught Exception
process.on("uncaughtException", (err) => {
    console.log('Error:', err.message);
    console.log('Shutting down the server for handling unknow error');
})

// config
if(process.env.NODE_ENV !== 'production') {
    require("dotenv").config({
        path: 'backend/config/.env'
    })
}
// create server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
})

// Unhandle Promise Rejections
process.on("unhandledRejection", (err) => {
    console.log('Error:', err.message);
    console.log('Shutting down the server for handling unhandle promise rejection');
    server.close(1)
})

// Connect Database
connectDatabase()