const app = require('./router')
const port = process.env.PORT || 3003

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})