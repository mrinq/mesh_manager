const express = require('express')
const networkRouter = require('./routes/network')
const provisionerRouter = require('./routes/provisioner')
// const nodeRouter = require('./routes/node')
const Provisioner = require('./models').provisioner
require('dotenv').config()

const app = express()

app.use(express.json())
app.use('/networks', networkRouter)
app.use('/provisioners', provisionerRouter)


// Provisioner.findOne({
//     where: {
//         provisioner_uuid: "552c442a45bcc1cbc33ac2212ccb3413",
//     }
// }).then((res) =>{
//     res.FetchNewAvailableRange()
//  });

module.exports = app