const express = require('express')
const networkRouter = require('./routes/network')
const provisionerRouter = require('./routes/provisioner')
const nodeRouter = require('./routes/node')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use('/networks', networkRouter)
app.use('/provisioners', provisionerRouter)
// app.use('/nodes', nodeRouter)

module.exports = app