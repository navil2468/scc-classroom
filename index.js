const express = require('express')
const app = express()
const port = 3000


app.set('views', './views')
app.set('view engine', 'ejs')

//sending
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
// Connect 


